<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		ShieldCheck, 
		Clock, 
		CheckCircle2, 
		XCircle, 
		ChevronRight,
		BarChart3,
		FileText,
		Lock,
		AlertCircle
	} from 'lucide-svelte';
	
	let { data } = $props();

	function formatCurrency(val: number | string) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
	}
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold flex items-center gap-3">
				<ShieldCheck class="text-brand-secondary" size={36} />
				E-Controlling (Validasi DPRD)
			</h1>
			<p class="text-slate-400 mt-1">Review dan setujui pengajuan anggaran daerah</p>
		</div>
	</div>

	<!-- Info Alert -->
	<div class="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex gap-4 items-center">
		<div class="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0 text-indigo-600">
			<Lock size={24} />
		</div>
		<div>
			<h4 class="font-bold text-indigo-900">Mekanisme Penguncian Data</h4>
			<p class="text-sm text-indigo-900/60 leading-relaxed">
				Setelah program disetujui, pagu anggaran akan secara otomatis **terkunci**. Perubahan anggaran hanya dapat dilakukan melalui revisi resmi sesuai Skenario 2.
			</p>
		</div>
	</div>

	<!-- List of Submissions -->
	<div class="space-y-6">
		<h2 class="text-2xl font-bold">Daftar Pengajuan Masuk</h2>
		
		<div class="grid gap-6">
			{#each data.programs as program}
				<div class="glass p-8 rounded-3xl group relative overflow-hidden border border-white hover:border-indigo-200 transition-all">
					<div class="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
					
					<div class="grid lg:grid-cols-4 gap-8 items-center relative z-10">
						<div class="lg:col-span-2 space-y-2">
							<div class="flex items-center gap-3">
								<span class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">{program.category}</span>
								<span class="text-xs text-slate-400 font-mono">#{program.code}</span>
							</div>
							<h3 class="text-2xl font-bold text-slate-800">{program.name}</h3>
							<div class="flex items-center gap-2 text-sm text-slate-400">
								<Clock size={14} /> Diajukan pada {program.createdAt ? new Date(program.createdAt).toLocaleDateString('id-ID') : '-'}
							</div>
						</div>

						<div>
							<p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Pagu Diajukan</p>
							<h4 class="text-2xl font-black text-slate-800">{formatCurrency(program.totalBudget)}</h4>
							<a href="/dashboard/planning/{program.id}" class="text-xs font-bold text-brand-primary flex items-center gap-1 mt-2 hover:underline">
								Lihat Rincian Item <ChevronRight size={14} />
							</a>
						</div>

						<div class="flex gap-3">
							<form method="POST" action="?/approve" use:enhance class="flex-1">
								<input type="hidden" name="id" value={program.id} />
								<button class="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
									<CheckCircle2 size={18} /> Approve
								</button>
							</form>
							<form method="POST" action="?/reject" use:enhance class="flex-1">
								<input type="hidden" name="id" value={program.id} />
								<button class="w-full py-4 bg-white text-rose-500 border border-rose-100 font-bold rounded-2xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
									<XCircle size={18} /> Reject
								</button>
							</form>
						</div>
					</div>
				</div>
			{:else}
				<div class="p-20 text-center glass rounded-3xl">
					<div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
						<ShieldCheck size={40} />
					</div>
					<h3 class="text-xl font-bold text-slate-500">Tidak Ada Pengajuan Pending</h3>
					<p class="text-slate-400 mt-2">Semua program sudah divalidasi atau belum ada pengajuan baru.</p>
				</div>
			{/each}
		</div>
	</div>
</div>
