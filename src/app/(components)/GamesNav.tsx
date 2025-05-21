"use client";
import { logoutUser } from "@/lib/serverfunctions";
import Link from "next/link";

export default function GamesNav() {
	return (
		<nav className='w-full md:px-8 px-2 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
			<Link href='/' className='font-bold text-2xl'>
				StreamGame
			</Link>

			<div className='flex items-center gap-2'>
				<Link
					href='/games'
					className='bg-blue-500 text-sm text-white px-4 py-2 rounded-md cursor-pointer'
				>
					Dashboard
				</Link>

				<button
					className='bg-red-600 text-sm hover:bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer'
					onClick={logoutUser}
				>
					Log Out
				</button>
			</div>
		</nav>
	);
}