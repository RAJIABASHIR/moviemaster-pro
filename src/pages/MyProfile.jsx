
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function MyProfile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize state when user loads or edit mode starts
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
        }
    }, [user, isEditing]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUser({
                displayName,
                photoURL
            });
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="h1 mb-6">My Profile</h1>

            <div className="card p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    {/* Avatar Display */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                            {photoURL ? (
                                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (displayName?.[0] || user?.email?.[0]?.toUpperCase())
                            )}
                        </div>
                    </div>


                    <div className="text-center md:text-left flex-1 w-full">
                        {isEditing ? (
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-1">
                                    <label className="label">Display Name</label>
                                    <input
                                        type="text"
                                        className="input w-full"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="label">Profile Picture URL</label>
                                    <input
                                        type="url"
                                        className="input w-full"
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                        placeholder="https://example.com/me.jpg"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold">{user?.displayName || "No Name Set"}</h2>
                                <p className="text-slate-500">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    User
                                </span>
                            </>
                        )}
                    </div>

                    <div className="self-center md:self-start mt-4 md:mt-0">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    className="btn bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        ) : (
                            <button className="btn" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-slate-500 block mb-1">Display Name</label>
                            <p className="font-medium">{user?.displayName || "Not provided"}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500 block mb-1">Email Address</label>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500 block mb-1">Member Since</label>
                            <p className="font-medium">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500 block mb-1">Last Login</label>
                            <p className="font-medium">{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : "Unknown"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
