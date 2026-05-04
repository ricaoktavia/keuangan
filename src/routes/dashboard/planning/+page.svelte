<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		Plus, 
		Search, 
		Filter, 
		Clock, 
		CheckCircle2, 
		XCircle, 
		ChevronRight,
		FileCode,
		Calendar,
		X
	} from 'lucide-svelte';
	
	let { data, form } = $props();
	let searchQuery = $state('');
	let showModal = $state(false);

	const filteredPrograms = $derived(
		data.programs.filter(p => 
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
			p.code.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function getStatusClass(status: string) {
		switch (status) {
			case 'approved': return 'bg-emerald-100 text-emerald-600';
			case 'rejected': return 'bg-rose-100 text-rose-600';
			default: return 'bg-amber-100 text-amber-600';
		}
	}
</script>

{#snippet statusIcon(status)}
	{#if status === 'approved'}
		<CheckCircle2 size={14} />
	{:else if status === 'rejected'}
		<XCircle size={14} />
	{:else}
		<Clock size={14} />
	{/if}
{/snippet}

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold">E-Planning</h1>
			<p class="text-slate-400 mt-1">Input dan kelola program anggaran tahunan</p>
		</div>
		<button 
			onclick={() => showModal = true}
			class="flex items-center gap-2 px-6 py-3 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
		>
			<Plus size={20} />
			Tambah Program
		</button>
	</div>

	<!-- Stats / Overview -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="glass p-6 rounded-3xl">
			<p class="text-slate-400 text-sm font-medium">Total Program</p>
			<h3 class="text-2xl font-bold mt-1 text-slate-800">{data.programs.length}</h3>
		</div>
		<div class="glass p-6 rounded-3xl">
			<p class="text-slate-400 text-sm font-medium">Status Diajukan</p>
			<h3 class="text-2xl font-bold mt-1 text-amber-500">
				{data.programs.filter(p => p.status === 'diajukan').length}
			</h3>
		</div>
		<div class="glass p-6 rounded-3xl">
			<p class="text-slate-400 text-sm font-medium">Status Disetujui</p>
			<h3 class="text-2xl font-bold mt-1 text-emerald-500">
				{data.programs.filter(p => p.status === 'approved').length}
			</h3>
		</div>
	</div>

	<!-- Filter & Search -->
	<div class="flex gap-4">
		<div class="relative flex-1 group">
			<Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Cari nama program atau kode rekening..."
				class="w-full pl-12 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
			/>
		</div>
		<button class="p-3 glass rounded-2xl text-slate-500 hover:text-brand-primary transition-colors">
			<Filter size={24} />
		</button>
	</div>

	<!-- List -->
	<div class="space-y-4">
		{#each filteredPrograms as program}
			<a 
				href="/dashboard/planning/{program.id}"
				class="block glass p-6 rounded-3xl border border-white hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-6">
						<div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-brand-primary transition-colors">
							<FileCode size={28} />
						</div>
						<div>
							<div class="flex items-center gap-3 mb-1">
								<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{program.category}</span>
								<span class="w-1 h-1 rounded-full bg-slate-300"></span>
								<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
									<Calendar size={10} /> {program.budgetYear}
								</span>
							</div>
							<h3 class="text-xl font-bold text-slate-800">{program.name}</h3>
							<p class="text-sm text-slate-400 font-mono tracking-wider mt-1">{program.code}</p>
						</div>
					</div>

					<div class="flex items-center gap-6">
						<div class="flex flex-col items-end">
							<p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
							<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold capitalize {getStatusClass(program.status)}">
								{@render statusIcon(program.status)}
								{program.status}
							</div>
						</div>
						<ChevronRight size={24} class="text-slate-300 group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</a>
		{:else}
			<div class="p-20 text-center glass rounded-3xl">
				<div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
					<Search size={40} />
				</div>
				<h3 class="text-xl font-bold text-slate-500">Program Tidak Ditemukan</h3>
				<p class="text-slate-400 mt-2">Coba gunakan kata kunci lain atau tambah program baru.</p>
			</div>
		{/each}
	</div>
</div>

<!-- Modal Tambah Program -->
{#if showModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
		<div class="glass max-w-xl w-full p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300">
			<button 
				onclick={() => showModal = false}
				class="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
			>
				<X size={24} />
			</button>

			<h2 class="text-2xl font-bold mb-2">Tambah Program Baru</h2>
			<p class="text-slate-400 text-sm mb-8">Masukkan rincian program pembangunan untuk tahun anggaran berjalan.</p>

			{#if form?.message}
				<div class="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-6 text-sm border border-rose-100 flex items-center gap-3">
					<XCircle size={18} />
					{form.message}
				</div>
			{/if}

			<form 
				method="POST" 
				action="?/create" 
				use:enhance={() => {
					return ({ result }) => {
						if (result.type === 'success') {
							showModal = false;
						}
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-2 gap-6">
					<div class="space-y-2 col-span-2">
						<label for="name" class="text-sm font-semibold text-slate-700 ml-1">Nama Program</label>
						<input 
							type="text" 
							name="name" 
							id="name" 
							placeholder="Misal: Pembangunan Jembatan Madura"
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>

					<div class="space-y-2">
						<label for="category" class="text-sm font-semibold text-slate-700 ml-1">Kategori</label>
						<select 
							name="category" 
							id="category"
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none appearance-none"
							required
						>
							<option value="Infrastruktur">Infrastruktur</option>
							<option value="Pendidikan">Pendidikan</option>
							<option value="Kesehatan">Kesehatan</option>
							<option value="Sosial">Sosial</option>
							<option value="Ekonomi">Ekonomi</option>
						</select>
					</div>

					<div class="space-y-2">
						<label for="budgetYear" class="text-sm font-semibold text-slate-700 ml-1">Tahun Anggaran</label>
						<input 
							type="number" 
							name="budgetYear" 
							id="budgetYear" 
							value={new Date().getFullYear()}
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>

					<div class="space-y-2 col-span-2">
						<label for="code" class="text-sm font-semibold text-slate-700 ml-1">Kode Rekening</label>
						<div class="relative group">
							<FileCode class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
							<input 
								type="text" 
								name="code" 
								id="code" 
								placeholder="00.000.00.00.0"
								class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none font-mono"
								required
							/>
						</div>
						<p class="text-[10px] text-slate-400 ml-1 lowercase">Sistem akan mengecek duplikasi kode pada tahun yang sama secara otomatis.</p>
					</div>
				</div>

				<div class="flex gap-4 pt-4">
					<button 
						type="button"
						onclick={() => showModal = false}
						class="flex-1 py-4 glass text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
					>
						Batal
					</button>
					<button 
						type="submit" 
						class="flex-[2] py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
					>
						Simpan & Lanjutkan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
