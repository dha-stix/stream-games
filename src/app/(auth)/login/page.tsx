"use client";
import { loginUser } from "@/lib/serverfunctions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Login() {
	const router = useRouter();
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const { user, message } = await loginUser(formData)
		if (user) {
			toast.success("Sign in successful! 🎉", {
				description: message
			})
			router.push("/games");
		} else {
			toast.error("Authentication Failed", {
				description: message
			})
			setButtonClicked(false);
		}
	};

	return (
		<section className='mx-auto md:w-3/4 w-full h-screen flex flex-col justify-center md:px-8 px-6 items-center'>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Log in
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='email' className='mb-2 opacity-60'>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<button
					type='submit'
					className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Signing in" : "Sign in"}
				</button>
				<p className=' opacity-60 text-center'>
					Don&apos;t have an account?{" "}
					<Link href='/register' className='text-blue-800'>
						Create one
					</Link>
				</p>
			</form>
		</section>
	);
}