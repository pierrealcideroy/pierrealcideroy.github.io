import AppKit
import WebKit
let dir = URL(fileURLWithPath: CommandLine.arguments[1])
let out = CommandLine.arguments[2]
final class Shot: NSObject, WKNavigationDelegate {
  let wv = WKWebView(frame: NSRect(x: 0, y: 0, width: 1200, height: 630))
  func start() { wv.navigationDelegate = self; wv.loadFileURL(dir.appendingPathComponent("og.html"), allowingReadAccessTo: dir) }
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
      let c = WKSnapshotConfiguration(); c.rect = CGRect(x: 0, y: 0, width: 1200, height: 630); c.snapshotWidth = 1200
      w.takeSnapshot(with: c) { img, err in
        guard let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
              let png = rep.representation(using: .png, properties: [:]) else { print("fail", err as Any); exit(1) }
        try! png.write(to: URL(fileURLWithPath: out)); print("ok", rep.pixelsWide, rep.pixelsHigh); exit(0)
      }
    }
  }
}
let app = NSApplication.shared
let s = Shot(); s.start()
app.run()
