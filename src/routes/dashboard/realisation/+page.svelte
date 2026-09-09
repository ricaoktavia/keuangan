<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		FileText, 
		Upload, 
		MapPin, 
		DollarSign, 
		History, 
		Search,
		Plus,
		CheckCircle2,
		XCircle,
		ExternalLink
	} from 'lucide-svelte';
	
	let { data, form } = $props();
	let selectedProgramId = $state('');
	let showSuccess = $state(false);

	const selectedProgram = $derived(data.programs.find(p => p.id === parseInt(selectedProgramId)));
	const remainingBudget = $derived(selectedProgram ? parseFloat(selectedProgram.totalBudget) - selectedProgram.spent : 0);

	function formatCurrency(val: number | string) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
	}

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const latInput = document.getElementById('latitude') as HTMLInputElement;
				const lngInput = document.getElementById('longitude') as HTMLInputElement;
				if (latInput) latInput.value = position.coords.latitude.toString();
				if (lngInput) lngInput.value = position.coords.longitude.toString();
			});
		}
	}
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold flex items-center gap-3 text-brand-secondary">
				<FileText size={36} />
				Realisasi & Bukti Fisik
			</h1>
			<p class="text-slate-400 mt-1">Input penggunaan dana dan unggah bukti kwitansi/foto</p>
		</div>
	</div>

	<div class="grid lg:grid-cols-5 gap-8">
		<!-- Main Form Component -->
		<div class="lg:col-span-3 space-y-6">
			<div class="glass p-8 rounded-3xl relative overflow-hidden">
				<h2 class="text-2xl font-bold mb-6">Input Realisasi Baru</h2>
				
				{#if form?.message}
					<div class="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-6 text-sm border border-rose-100 flex items-center gap-3 animate-in shake duration-300">
						<XCircle size={18} />
						{form.message}
					</div>
				{/if}

				<form 
					method="POST" 
					action="?/submit" 
					enctype="multipart/form-data" 
					use:enhance={() => {
						return ({ result }) => {
							if (result.type === 'success') {
								showSuccess = true;
								setTimeout(() => showSuccess = false, 3000);
							}
						};
					}}
					class="space-y-6"
				>
					<div class="space-y-2">
						<label for="programId" class="text-sm font-semibold text-slate-700 ml-1">Pilih Program Pembangunan</label>
						<select 
							name="programId" 
							id="programId" 
							bind:value={selectedProgramId}
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						>
							<option value="">-- Pilih Program --</option>
							{#each data.programs as program}
								<option value={program.id}>{program.name}</option>
							{/each}
						</select>
						{#if selectedProgram}
							<div class="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl text-xs">
								<span class="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Sisa Pagu Tersedia</span>
								<span class="font-bold text-brand-success">{formatCurrency(remainingBudget)}</span>
							</div>
						{/if}
					</div>

					<div class="grid md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="amount" class="text-sm font-semibold text-slate-700 ml-1">Jumlah Realisasi (Rp)</label>
							<div class="relative group">
								<DollarSign class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
								<input 
									type="number" 
									name="amount" 
									id="amount" 
									placeholder="50000000"
									class="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
									required
								/>
							</div>
						</div>
						<div class="space-y-2">
							<label for="evidence" class="text-sm font-semibold text-slate-700 ml-1">Bukti File (PDF/Foto)</label>
							<div class="flex items-center gap-2">
								<label class="flex-1 px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl border-dashed hover:border-brand-primary hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-400 text-sm">
									<Upload size={18} />
									<span class="truncate">Klik untuk Unggah</span>
									<input type="file" name="evidence" id="evidence" accept="image/*,application/pdf" class="hidden" required />
								</label>
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<label for="description" class="text-sm font-semibold text-slate-700 ml-1">Keterangan / Deskripsi Penggunaan</label>
						<textarea 
							name="description" 
							id="description" 
							rows="3"
							placeholder="Misal: Pembelian material semen Tiga Roda sebanyak 100 sak..."
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none resize-none"
							required
						></textarea>
					</div>

					<div class="space-y-2">
						<div class="flex justify-between items-center ml-1">
							<label for="coords" class="text-sm font-semibold text-slate-700">Koordinat Lokasi Proyek</label>
							<button type="button" onclick={getLocation} class="text-[10px] font-bold text-brand-primary uppercase hover:underline">Dapatkan Lokasi Saya</button>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div class="relative group">
								<MapPin class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
								<input 
									type="text" 
									name="latitude" 
									id="latitude" 
									placeholder="Latitude"
									class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
									readonly
								/>
							</div>
							<div class="relative group">
								<MapPin class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
								<input 
									type="text" 
									name="longitude" 
									id="longitude" 
									placeholder="Longitude"
									class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
									readonly
								/>
							</div>
						</div>
					</div>

					<button 
						type="submit" 
						class="w-full py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
					>
						Submit Realisasi
					</button>

					{#if showSuccess}
						<div class="mt-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in zoom-in-95">
							<CheckCircle2 size={24} />
							<span class="font-bold">Realisasi Berhasil Disimpan!</span>
						</div>
					{/if}
				</form>
			</div>
		</div>

		<!-- Recent Activity / History -->
		<div class="lg:col-span-2 space-y-6">
			<div class="glass p-8 rounded-3xl">
				<h2 class="text-xl font-bold mb-6 flex items-center gap-2">
					<History size={20} class="text-slate-400" />
					Laporan Terakhir
				</h2>
				
				<div class="space-y-4">
					{#each data.recentRealizations as item}
						<div class="p-5 bg-white/50 border border-slate-100 rounded-2xl group hover:shadow-lg transition-all">
							<div class="flex justify-between items-start mb-3">
								<div class="text-[10px] font-bold text-slate-400 uppercase">{item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : '-'}</div>
								<div class="font-bold text-brand-secondary">{formatCurrency(item.amount)}</div>
							</div>
							<p class="text-sm font-semibold text-slate-800 mb-2">{item.description}</p>
							{#if item.evidenceUrl}
								<a href={item.evidenceUrl} target="_blank" class="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline">
									Lihat Bukti Fisik <ExternalLink size={12} />
								</a>
							{/if}
						</div>
					{:else}
						<div class="text-center p-12 text-slate-400 italic">
							Belum ada laporan realisasi terbaru.
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
