"use client";
import { registerUser } from "@/lib/serverfunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Register() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const { user, message } = await registerUser(formData);
		if (user) {
			toast.success("Account created successfully! 🎉", {
				description: message
			})
			router.push("/login");
		} else {
			toast.error("Failed to create account", {
				description: message
			})
			setButtonClicked(false);
		}
	};

	return (
		<section className='mx-auto md:w-3/4 h-screen w-full flex flex-col items-center justify-center md:px-8 px-6 py-8 '>
			<h2 className='text-3xl font-bold mb-3 text-center'>Register</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='nickname' className='mb-2 opacity-60  '>
					Nickname
				</label>
				<input
					required
					type='text'
					id='nickname'
					name='nickname'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
					placeholder='yournickname'
				/>
				<label htmlFor='email' className='mb-2 opacity-60  '>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
					placeholder='cde@ab.com'
				/>

				<label htmlFor='password' className='mb-2 opacity-60  '>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					minLength={8}
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<button
					className='mt-2 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account?{" "}
					<Link href='/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}