export default function Help() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-medium mb-2">How do I verify my account?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Check your email inbox for a verification link sent upon registration.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-medium mb-2">Can I delete my account?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Yes, you can delete your account from the Profile Settings page in your dashboard.
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-3">Still need help?</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Contact our support team at <a href="mailto:support@moviemaster.pro" className="text-primary hover:underline">support@moviemaster.pro</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
