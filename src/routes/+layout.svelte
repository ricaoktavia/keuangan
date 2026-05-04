<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { 
		LayoutDashboard, 
		ClipboardList, 
		Settings, 
		LogOut, 
		ShieldCheck, 
		FileText, 
		Users,
		Menu,
		X,
		BarChart3
	} from 'lucide-svelte';
	
	let { children, data } = $props();
	let isSidebarOpen = $state(false);

	const navItems = [
		{ name: 'Dashboard Public', path: '/', icon: BarChart3, roles: ['umum', 'admin', 'dprd', 'pelaksana', 'auditor'] },
		{ name: 'E-Planning', path: '/dashboard/planning', icon: ClipboardList, roles: ['admin', 'auditor'] },
		{ name: 'E-Controlling', path: '/dashboard/controlling', icon: ShieldCheck, roles: ['dprd', 'admin', 'auditor'] },
		{ name: 'Realisasi', path: '/dashboard/realisation', icon: FileText, roles: ['pelaksana', 'admin', 'auditor'] },
		{ name: 'Audit Logs', path: '/dashboard/audit', icon: LayoutDashboard, roles: ['auditor', 'admin'] },
	];

	const user = $derived(data.user);
	const activeNavItems = $derived(navItems.filter(item => item.roles.includes(user?.role || 'umum')));
</script>

<svelte:head>
	<title>E-Keuangan | Sistem Informasi Keuangan Daerah</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside class="fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:translate-x-0 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} glass rounded-r-3xl m-4 lg:my-4 mr-0">
		<div class="flex flex-col h-full p-6">
			<div class="flex items-center gap-3 mb-10">
				<div class="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
					<BarChart3 size={24} />
				</div>
				<h1 class="text-xl font-bold text-gradient leading-tight">E-KEUANGAN</h1>
			</div>

			<nav class="flex-1 space-y-2">
				{#each activeNavItems as item}
					<a 
						href={item.path} 
						class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group {page.url.pathname === item.path ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}"
					>
						<item.icon size={20} class={page.url.pathname === item.path ? 'text-white' : 'group-hover:text-brand-primary transition-colors'} />
						<span class="font-medium">{item.name}</span>
					</a>
				{/each}
			</nav>

			<div class="mt-auto pt-6 border-t border-slate-200">
				{#if user}
					<div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
						<div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
							{user.name.charAt(0)}
						</div>
						<div class="flex-1 overflow-hidden">
							<p class="text-sm font-semibold truncate">{user.name}</p>
							<p class="text-xs text-slate-400 capitalize">{user.role}</p>
						</div>
					</div>
					<form action="/logout" method="POST">
						<button class="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-all">
							<LogOut size={20} />
							<span class="font-medium">Sign Out</span>
						</button>
					</form>
				{:else}
					<a href="/login" class="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-2xl bg-slate-100 font-semibold hover:bg-slate-200 transition-all">
						Sign In
					</a>
				{/if}
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 lg:ml-72 p-4 lg:p-8">
		<!-- Header Mobile/Responsive -->
		<header class="flex items-center justify-between mb-8 lg:hidden">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white">
					<BarChart3 size={24} />
				</div>
				<h1 class="text-xl font-bold">E-KEUANGAN</h1>
			</div>
			<button class="p-2 glass rounded-xl" onclick={() => isSidebarOpen = !isSidebarOpen}>
				{#if isSidebarOpen}<X size={24} />{:else}<Menu size={24} />{/if}
			</button>
		</header>

		<div class="max-w-7xl mx-auto">
			{@render children()}
		</div>
	</main>
</div>
