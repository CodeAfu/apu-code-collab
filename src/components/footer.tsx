export default function Footer() {
  return (
    <footer className="bg-muted border-t mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-semibold mb-3">APU Code Collab</h3>
            <p className="text-sm text-muted-foreground">
              Collaborate, learn, and build together with fellow university students.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Projects</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} APU Code Collab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
