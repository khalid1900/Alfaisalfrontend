import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
	const error = useRouteError();

	return (
		<div
			id="error-page"
			className="flex flex-col justify-center items-center min-h-[50vh]"
		>
			<h1 className="text-xl font-bold text-center">Oops!</h1>
			<p className="text-center">
				Sorry, an unexpected error has occurred.
			</p>
			<p className="text-red-500 text-5xl text-center">
				{error.statusText || error.data}
			</p>
		</div>
	);
}
