import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABEL } from '../../lib/permissions';

export function StaffHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/staff/login', { replace: true });
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <span className="font-semibold">EACHRights UPR Dashboard</span>

      {profile && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-700">{profile.full_name}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {ROLE_LABEL[profile.role]}
          </span>
          <button onClick={handleSignOut} className="text-blue-600 hover:underline">
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
