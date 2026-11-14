// Email signature images, as PNG at 2x (email clients don't show SVG, round corners or CSS filters reliably,
// so circles, rounded corners and the grey photo are baked into the files).
// Run from the site root:  swift tools/email/make_signature_images.swift
import AppKit
import CoreImage

let out = "assets/email/"

func save(_ rep: NSBitmapImageRep, _ name: String) {
    let data = rep.representation(using: .png, properties: [:])!
    try! data.write(to: URL(fileURLWithPath: out + name))
    print(name, rep.pixelsWide, "x", rep.pixelsHigh)
}
func canvas(_ w: Int, _ h: Int, _ draw: (CGContext) -> Void) -> NSBitmapImageRep {
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4,
                               hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    let ctx = NSGraphicsContext(bitmapImageRep: rep)!
    NSGraphicsContext.current = ctx
    ctx.imageInterpolation = .high
    draw(ctx.cgContext)
    NSGraphicsContext.restoreGraphicsState()
    return rep
}
func svg(_ s: String) -> NSImage { NSImage(data: s.data(using: .utf8)!)! }

// Portrait: circle, grey (like the site) and in colour.
let photo = CIImage(contentsOf: URL(fileURLWithPath: "assets/pa.jpg"))!
let mono = photo.applyingFilter("CIColorControls", parameters: ["inputSaturation": 0, "inputContrast": 1.05])
let ci = CIContext()
for (img, name) in [(mono, "pa-photo.png"), (photo, "pa-photo-color.png")] {
    let cg = ci.createCGImage(img, from: img.extent)!
    let side = 192
    save(canvas(side, side) { c in
        let r = CGRect(x: 0, y: 0, width: side, height: side)
        c.addEllipse(in: r); c.clip()
        let e = img.extent, s = min(e.width, e.height)
        let src = cg.cropping(to: CGRect(x: (e.width - s) / 2, y: (e.height - s) / 2, width: s, height: s))!
        c.draw(src, in: r)
    }, name)
}

// PA logo: the strokes of favicon.svg. Dark version gets a thin white halo so it stays readable
// when a mail app paints a dark background behind it (Gmail and Outlook dark modes).
let logoPaths = try! String(contentsOfFile: "favicon.svg", encoding: .utf8)
    .components(separatedBy: "\n").filter { $0.hasPrefix("<path") }.joined()
func logo(_ stroke: String, halo: Bool) -> NSImage {
    let haloGroup = halo ? "<g stroke=\"#ffffff\" stroke-width=\"64\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\(logoPaths)</g>" : ""
    return svg("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"62 72 356 356\" width=\"356\" height=\"356\" fill=\"none\">\(haloGroup)<g stroke=\"\(stroke)\" stroke-width=\"40\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\(logoPaths)</g></svg>")
}
for (img, name) in [(logo("#191919", halo: true), "pa-logo.png"), (logo("#ffffff", halo: false), "pa-logo-white.png")] {
    save(canvas(96, 96) { _ in img.draw(in: NSRect(x: 0, y: 0, width: 96, height: 96)) }, name)
}

// Spiller! icon with the iOS corner radius baked in.
let icon = NSImage(contentsOfFile: "spiller/media/icon.png")!
save(canvas(96, 96) { c in
    let r = CGRect(x: 0, y: 0, width: 96, height: 96)
    c.addPath(CGPath(roundedRect: r, cornerWidth: 21.5, cornerHeight: 21.5, transform: nil)); c.clip()
    icon.draw(in: r)
}, "spiller-icon.png")

// Official black App Store badge, untouched, 40 px high at 2x.
let badge = NSImage(contentsOfFile: "assets/badges/app-store-black.svg")!
let bw = Int((80.0 * badge.size.width / badge.size.height).rounded())
save(canvas(bw, 80) { _ in badge.draw(in: NSRect(x: 0, y: 0, width: bw, height: 80)) }, "app-store-badge.png")

// Social icons, grey like the site's (16 px at 2x), from the SVG symbols of the home page.
let home = try! String(contentsOfFile: "index.html", encoding: .utf8)
for k in ["linkedin", "bluesky", "github", "whatsapp", "instagram"] {
    let re = try! NSRegularExpression(pattern: "<symbol id=\"i-\(k)\" viewBox=\"([^\"]+)\"><path d=\"([^\"]+)\"")
    let m = re.firstMatch(in: home, range: NSRange(home.startIndex..., in: home))!
    let box = String(home[Range(m.range(at: 1), in: home)!]), d = String(home[Range(m.range(at: 2), in: home)!])
    let s = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"\(box)\" width=\"24\" height=\"24\"><path fill=\"#6a6a6a\" d=\"\(d)\"/></svg>"
    save(canvas(32, 32) { _ in svg(s).draw(in: NSRect(x: 0, y: 0, width: 32, height: 32)) }, "\(k).png")
}
