<script lang="ts">
	import { 
		Search, 
		Filter, 
		FileCode,
		Calendar,
		ChevronRight,
		ExternalLink
	} from 'lucide-svelte';
	
	let { data } = $props();
	let searchQuery = $state('');

	const filteredPrograms = $derived(
		data.programs.filter(p => 
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			p.code.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function formatCurrency(val: number | string) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
	}
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold">Daftar Proyek Pembangunan</h1>
			<p class="text-slate-400 mt-1">Transparansi alokasi dan realisasi dana daerah</p>
		</div>
	</div>

	<!-- Filter & Search -->
	<div class="flex gap-4">
		<div class="relative flex-1 group">
			<Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Cari nama proyek atau kode..."
				class="w-full pl-12 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
			/>
		</div>
		<button class="p-3 glass rounded-2xl text-slate-500 hover:text-brand-primary transition-colors">
			<Filter size={24} />
		</button>
	</div>

	<!-- Project List Grid -->
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredPrograms as program}
			<div class="glass p-6 rounded-3xl group hover:border-brand-primary/30 hover:shadow-xl transition-all flex flex-col">
				<div class="flex items-start justify-between mb-6">
					<div class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
						{program.category}
					</div>
					<div class="text-[10px] text-slate-300 font-mono">#{program.code}</div>
				</div>
				
				<h3 class="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors flex-1">{program.name}</h3>
				
				<div class="space-y-4 mt-6">
					<div class="flex justify-between text-sm">
						<span class="text-slate-400">Pagu Anggaran</span>
						<span class="font-bold">{formatCurrency(program.totalBudget)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-slate-400">Realisasi</span>
						<span class="font-bold text-brand-secondary">{formatCurrency(program.totalRealization)}</span>
					</div>
					<div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
						<div 
							class="bg-brand-secondary h-full transition-all duration-1000" 
							style="width: {parseFloat(program.totalBudget) > 0 ? Math.min((program.totalRealization / parseFloat(program.totalBudget) * 100), 100).toFixed(1) : 0}%"
						></div>
					</div>
				</div>

				<button class="w-full py-3 bg-slate-50 text-slate-600 font-semibold rounded-xl mt-6 hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2">
					Detail Proyek <ExternalLink size={16} />
				</button>
			</div>
		{:else}
			<div class="col-span-full p-20 text-center glass rounded-3xl">
				<div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
					<Search size={40} />
				</div>
				<h3 class="text-xl font-bold text-slate-500">Proyek Tidak Ditemukan</h3>
				<p class="text-slate-400 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
			</div>
		{/each}
	</div>
</div>
