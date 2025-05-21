import Link from "next/link";

export default function Home() {
	return (
		<div className='w-full h-screen'>
			<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
				<Link href='/' className='font-bold text-2xl'>
					StreamGame
				</Link>

				<button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>
					Source Code
				</button>
			</nav>
			<section className='h-[90vh] text-center w-full py-8 lg:px-[50px] px-4 flex flex-col items-center justify-center'>
				<h1 className='text-5xl lg:text-7xl font-extrabold text-blue-500 mb-5'>
					3-in-1 Gaming Platform
				</h1>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Play games, join tournaments, and network with other gamers.
				</p>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Win games and earn points on the leaderboard.
				</p>

				<div className='flex items-center justify-center mt-8'>
					<Link
						href='/login'
						className='bg-blue-500 text-white px-6 py-3 rounded-md cursor-pointer'
					>
						Log in
					</Link>
					<Link
						href='/register'
						className='bg-gray-200 text-gray-800 px-6 py-3 rounded-md cursor-pointer ml-5'
					>
						Create Account
					</Link>
				</div>
			</section>
		</div>
	);
}