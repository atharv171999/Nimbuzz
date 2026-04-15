import { auth } from '@/auth';
import { supabase } from '@/app/lib/supabase';
import { fetchLocalActivities } from '@/app/actions/society';
import SocietyClientPage from './SocietyClientPage';
import { redirect } from 'next/navigation';

export default async function SocietyPage({ searchParams }) {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    // Get current user UUID for participate logic
    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

    if (!userData) redirect('/login');

    // Handle search params for filtering
    const resolvedParams = await searchParams;
    const category = resolvedParams?.category || 'All';
    const area = resolvedParams?.area || '';

    const activities = await fetchLocalActivities({ category, area });

    // Inject the currentUser's ID into the activity data for frontend use
    const activitiesWithUserInfo = activities.map(act => ({
        ...act,
        current_user_id: userData.id
    }));

    return (
        <SocietyClientPage 
            initialActivities={activitiesWithUserInfo}
            initialFilters={{ category, area }}
            currentUserEmail={session.user.email}
        />
    );
}
