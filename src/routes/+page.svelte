<script lang="ts">
	import { Bar, Doughnut } from 'svelte-chartjs';
	import { 
		Chart as ChartJS, 
		Title, 
		Tooltip, 
		Legend, 
		BarElement, 
		CategoryScale, 
		LinearScale, 
		ArcElement 
	} from 'chart.js';
	import { 
		TrendingUp, 
		DollarSign, 
		PieChart, 
		AlertTriangle, 
		Download, 
		ExternalLink,
		ChevronRight,
		BarChart3
	} from 'lucide-svelte';
	
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

	let { data } = $props();

	const budgetVsRealizationData = $derived({
		labels: data.programs.map(p => p.name.substring(0, 20) + (p.name.length > 20 ? '...' : '')),
		datasets: [
			{
				label: 'Pagu Anggaran',
				data: data.programs.map(p => parseFloat(p.totalBudget)),
				backgroundColor: 'rgba(14, 165, 233, 0.7)',
				borderRadius: 8,
			},
			{
				label: 'Realisasi',
				data: data.programs.map(p => p.totalRealization),
				backgroundColor: 'rgba(99, 102, 241, 0.7)',
				borderRadius: 8,
			}
		]
	});

	const summaryData = $derived({
		labels: ['Sisa Pagu', 'Realisasi'],
		datasets: [
			{
				data: [
					Math.max(0, Number(data.summary.totalBudget || 0) - Number(data.summary.totalRealization || 0)),
					Number(data.summary.totalRealization || 0)
				],
				backgroundColor: ['rgba(226, 232, 240, 0.8)', 'rgba(99, 102, 241, 0.8)'],
				borderColor: ['#fff', '#fff'],
				borderWidth: 2,
			}
		]
	});

	function formatCurrency(val: number | string) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
	}

	const totalBudget = $derived(Number(data.summary.totalBudget));
	const totalRealization = $derived(Number(data.summary.totalRealization));
	const realizationPercent = $derived(totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0);
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
	<!-- Hero Section -->
	<div class="glass p-10 rounded-3xl overflow-hidden relative">
		<div class="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
		
		<div class="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<span class="px-4 py-1.5 bg-blue-100 text-brand-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">Transparansi Dana Desa & Kota</span>
				<h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-6 mt-2">
					Monitoring Anggaran <br />
					<span class="text-gradient">Real-Time & Akuntabel</span>
				</h1>
				<p class="text-slate-500 text-lg mb-8 max-w-lg">
					Pantau setiap rupiah pembangunan daerah Anda. Kami menyajikan data anggaran dan realisasi secara transparan dan jujur.
				</p>
				<div class="flex gap-4">
					<button class="px-8 py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
						Lihat Laporan Lengkap
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm">
					<div class="w-12 h-12 bg-blue-100 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
						<DollarSign size={24} />
					</div>
					<p class="text-slate-400 text-sm font-medium">Total Anggaran</p>
					<h3 class="text-xl font-bold mt-1">{formatCurrency(totalBudget)}</h3>
				</div>
				<div class="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm">
					<div class="w-12 h-12 bg-indigo-100 text-brand-secondary rounded-2xl flex items-center justify-center mb-4">
						<TrendingUp size={24} />
					</div>
					<p class="text-slate-400 text-sm font-medium">Total Realisasi</p>
					<h3 class="text-xl font-bold mt-1 text-brand-secondary">{formatCurrency(totalRealization)}</h3>
				</div>
				<div class="col-span-2 bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm flex items-center gap-6">
					<div class="w-24 h-24">
						<Doughnut data={summaryData} options={{ plugins: { legend: { display: false } }, cutout: '70%' }} />
					</div>
					<div class="flex-1">
						<p class="text-slate-400 text-sm font-medium">Persentase Realisasi</p>
						<h3 class="text-3xl font-bold mt-1 text-gradient">{realizationPercent.toFixed(1)}%</h3>
						<div class="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
							<div class="bg-gradient-premium h-full" style="width: {realizationPercent}%"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Charts Section -->
	<div class="grid lg:grid-cols-3 gap-8">
		<div class="lg:col-span-2 glass p-8 rounded-3xl">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h2 class="text-2xl font-bold">Budget vs Realisasi</h2>
					<p class="text-slate-400 text-sm">Perbandingan per program pembangunan</p>
				</div>
				<button class="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand-primary transition-colors">
					<BarChart3 size={20} />
				</button>
			</div>
			<div class="h-80">
				<Bar 
					data={budgetVsRealizationData} 
					options={{ 
						responsive: true, 
						maintainAspectRatio: false,
						scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } },
						plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Outfit' } } } }
					}} 
				/>
			</div>
		</div>

		<div class="glass p-8 rounded-3xl flex flex-col">
			<h2 class="text-2xl font-bold mb-2">Aduan Publik</h2>
			<p class="text-slate-400 text-sm mb-6">Melihat kejanggalan di lapangan? Laporkan kepada kami.</p>
			
			<div class="flex-1 space-y-4">
				<div class="p-6 bg-orange-50 border border-orange-100 rounded-2xl">
					<div class="flex items-center gap-3 text-orange-600 mb-3 font-semibold text-sm">
						<AlertTriangle size={18} />
						Waspada Markup!
					</div>
					<p class="text-orange-900/70 text-sm leading-relaxed">
						Jika proyek di web tertulis sdh selesai 100% namun di lapangan belum ada progres, segera lapor.
					</p>
				</div>
			</div>

			<button class="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all mt-6">
				Laporkan Kejanggalan
			</button>
		</div>
	</div>

	<!-- Project List Section -->
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">Daftar Proyek Pembangunan</h2>
			<a href="/projects" class="text-brand-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
				Lihat Semua <ChevronRight size={20} />
			</a>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.programs as program}
				<div class="glass p-6 rounded-3xl group hover:border-brand-primary/30 transition-all">
					<div class="flex items-start justify-between mb-6">
						<div class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
							{program.category}
						</div>
						<div class="text-[10px] text-slate-300 font-mono">#{program.id.toString().padStart(4, '0')}</div>
					</div>
					
					<h3 class="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">{program.name}</h3>
					
					<div class="space-y-4 mt-6">
						<div class="flex justify-between text-sm">
							<span class="text-slate-400">Anggaran</span>
							<span class="font-bold">{formatCurrency(program.totalBudget)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-slate-400">Realisasi</span>
							<span class="font-bold text-brand-secondary">{formatCurrency(program.totalRealization)}</span>
						</div>
						<div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
							<div 
								class="bg-brand-secondary h-full" 
								style="width: {(program.totalRealization / parseFloat(program.totalBudget) * 100).toFixed(1)}%"
							></div>
						</div>
					</div>

					<button class="w-full py-3 bg-slate-50 text-slate-600 font-semibold rounded-xl mt-6 hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2">
						Detail Pengeluaran <ExternalLink size={16} />
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>
