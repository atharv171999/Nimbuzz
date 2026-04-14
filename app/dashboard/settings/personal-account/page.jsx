import { auth } from '@/auth';
import { getUser } from '@/app/lib/db';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await getUser(session.user.email);
    
    if (!user) {
        return <div className="p-8 text-white">User not found.</div>;
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl backdrop-blur-xl shrink-0">
                <ProfileForm user={user} />
            </div>
        </div>
    );
}
