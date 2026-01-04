export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
                Have questions or feedback? We'd love to hear from you.
            </p>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" className="input w-full" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" className="input w-full" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea className="input w-full h-32" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    );
}
