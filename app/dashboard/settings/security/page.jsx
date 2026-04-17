import SecurityForm from './SecurityForm';

export const metadata = {
    title: 'Security Settings | Nimbuzz',
    description: 'Manage your password and account security settings.',
};

export default function SecurityPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SecurityForm />
        </div>
    );
}
