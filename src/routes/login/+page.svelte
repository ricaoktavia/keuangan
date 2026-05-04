<script lang="ts">
	import { enhance } from '$app/forms';
	import { BarChart3, Mail, Lock, ArrowRight } from 'lucide-svelte';
	
	let { form } = $props();
</script>

<div class="min-h-[80vh] flex items-center justify-center p-4">
	<div class="glass max-w-md w-full p-8 rounded-3xl relative overflow-hidden">
		<!-- Background Accents -->
		<div class="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
		<div class="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

		<div class="relative">
			<div class="flex flex-col items-center mb-8">
				<div class="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center text-white shadow-xl mb-4">
					<BarChart3 size={32} />
				</div>
				<h1 class="text-3xl font-bold text-gradient">Welcome Back</h1>
				<p class="text-slate-500 mt-2">Sign in to E-Keuangan Portal</p>
			</div>

			{#if form?.message}
				<div class="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border border-red-100">
					<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
					{form.message}
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-5">
				<div class="space-y-2">
					<label for="email" class="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
					<div class="relative group">
						<Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
						<input 
							type="email" 
							name="email" 
							id="email" 
							placeholder="admin@keuangan.go.id"
							class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="password" class="text-sm font-semibold text-slate-700 ml-1">Password</label>
					<div class="relative group">
						<Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
						<input 
							type="password" 
							name="password" 
							id="password" 
							placeholder="••••••••"
							class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>
				</div>

				<button 
					type="submit" 
					class="w-full py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
				>
					Sign In
					<ArrowRight size={20} class="group-hover:translate-x-1 transition-transform" />
				</button>
			</form>

			<div class="mt-8 text-center text-sm text-slate-400">
				Sistem Keuangan Digital Aman & Transparan
			</div>
		</div>
	</div>
</div>
