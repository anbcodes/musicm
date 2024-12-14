import { useLocation } from 'preact-iso';

export function Header() {
	return (
		<header class="p-4 bg-blue-600">
			<h1 class="text-2xl text-white">
				<a href="/">Music Manager</a>
			</h1>
		</header>
	);
}
