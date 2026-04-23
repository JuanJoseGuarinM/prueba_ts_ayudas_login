'use client';

import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        const data = await res.json();

        if (!res.ok) {
            await Swal.fire({
                title: 'Error',
                text: data.message || 'No se pudo cerrar la sesion',
                icon: 'error',
            });
            return;
        }

        await Swal.fire({
            title: 'Sesion cerrada',
            text: 'Tu sesion se cerro correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
        });

        router.push('/login');
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
        >
            Cerrar sesion
        </button>
    );
}
