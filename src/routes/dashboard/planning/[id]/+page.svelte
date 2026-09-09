<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		Plus, 
		Trash2, 
		ChevronLeft, 
		AlertTriangle, 
		CheckCircle2, 
		XCircle, 
		Calculator,
		ShoppingBag,
		Send,
		Clock
	} from 'lucide-svelte';
	
	let { data, form } = $props();
	let showAddModal = $state(false);

	function formatCurrency(val: number | string) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val));
	}

	const totalBudget = $derived(data.items.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0));
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
	<!-- Breadcrumbs / Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/dashboard/planning" class="p-3 glass rounded-2xl text-slate-400 hover:text-brand-primary transition-all">
				<ChevronLeft size={20} />
			</a>
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.program.category}</span>
					<span class="w-1 h-1 rounded-full bg-slate-300"></span>
					<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">T.A. {data.program.budgetYear}</span>
				</div>
				<h1 class="text-3xl font-bold">{data.program.name}</h1>
			</div>
		</div>
		
		<div class="flex items-center gap-3">
			<div class="px-4 py-2 rounded-2xl glass font-bold text-slate-600 flex items-center gap-2">
				<Calculator size={18} class="text-brand-primary" />
				{formatCurrency(totalBudget)}
			</div>
			
			{#if data.program.status === 'diajukan' && !data.program.isLocked}
				<div class="px-4 py-2 bg-amber-50 text-amber-600 rounded-2xl text-sm font-bold flex items-center gap-2">
					<CheckCircle2 size={18} />
					Diajukan
				</div>
			{/if}

			{#if data.program.status === 'approved'}
				<div class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-2">
					<CheckCircle2 size={18} />
					Approved
				</div>
			{/if}
		</div>
	</div>

	{#if form?.warning}
		<div class="bg-amber-50 text-amber-600 p-6 rounded-3xl border border-amber-100 flex items-center gap-4 animate-in slide-in-from-top-4">
			<div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
				<AlertTriangle size={24} />
			</div>
			<div>
				<h4 class="font-bold">Peringatan Standar Harga</h4>
				<p class="text-sm opacity-80">{form.warning}</p>
			</div>
		</div>
	{/if}

	<!-- Content Grid -->
	<div class="grid lg:grid-cols-3 gap-8">
		<!-- Items List -->
		<div class="lg:col-span-2 space-y-6">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-bold">Rincian Anggaran</h2>
				{#if !data.program.isLocked}
					<button 
						onclick={() => showAddModal = true}
						class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
					>
						<Plus size={18} /> Add Item
					</button>
				{/if}
			</div>

			<div class="glass rounded-3xl overflow-hidden">
				<table class="w-full text-left">
					<thead class="bg-slate-50/50 border-b border-slate-100">
						<tr>
							<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Uraian Pekerjaan / Barang</th>
							<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Harga Satuan</th>
							<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Vol</th>
							<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
							<th class="px-6 py-4"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-50">
						{#each data.items as item}
							<tr class="group hover:bg-slate-50/50 transition-colors">
								<td class="px-6 py-5">
									<div class="font-bold text-slate-700">{item.itemName}</div>
								</td>
								<td class="px-6 py-5 text-slate-500 font-medium">{formatCurrency(item.unitPrice)}</td>
								<td class="px-6 py-5 text-slate-500 font-medium text-center">{item.quantity}</td>
								<td class="px-6 py-5 text-right font-bold text-slate-800">{formatCurrency(item.totalPrice)}</td>
								<td class="px-6 py-5 text-right">
									{#if !data.program.isLocked}
										<form method="POST" action="?/deleteItem" use:enhance>
											<input type="hidden" name="id" value={item.id} />
											<button class="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
												<Trash2 size={18} />
											</button>
										</form>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="p-16 text-center text-slate-400 italic font-medium">
									Belum ada rincian item. Silakan tambahkan rincian anggaran.
								</td>
							</tr>
						{/each}
					</tbody>
					{#if data.items.length > 0}
						<tfoot class="bg-slate-50/50">
							<tr>
								<td colspan="3" class="px-6 py-6 text-right font-bold text-slate-400 uppercase tracking-widest">Total Keseluruhan</td>
								<td class="px-6 py-6 text-right text-xl font-black text-brand-primary">{formatCurrency(totalBudget)}</td>
								<td></td>
							</tr>
						</tfoot>
					{/if}
				</table>
			</div>
		</div>

		<!-- Sidebar Info & Actions -->
		<div class="space-y-6">
			<div class="glass p-8 rounded-3xl space-y-6">
				<h3 class="text-xl font-bold">Metadata Program</h3>
				<div class="space-y-4">
					<div>
						<p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Kode Rekening</p>
						<p class="font-mono text-sm bg-slate-100 p-2 rounded-xl text-slate-600">{data.program.code}</p>
					</div>
					<div>
						<p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Status Verifikasi</p>
						<div class="flex items-center gap-2 font-bold capitalize">
							{#if data.program.status === 'diajukan'}
								<Clock size={16} class="text-amber-500" />
								<span class="text-amber-500">Dalam Pengajuan</span>
							{:else if data.program.status === 'approved'}
								<CheckCircle2 size={16} class="text-emerald-500" />
								<span class="text-emerald-500">Disetujui DPRD</span>
							{:else}
								<XCircle size={16} class="text-rose-500" />
								<span class="text-rose-500">Ditolak</span>
							{/if}
						</div>
					</div>
					<div>
						<p class="text-[10px] text-slate-400 font-bold uppercase mb-1">Status Penguncian</p>
						<p class="text-sm font-bold">
							{data.program.isLocked ? '🔒 Terkunci (Non-Editable)' : '🔓 Terbuka (Draft)'}
						</p>
					</div>
				</div>

				{#if !data.program.isLocked && data.items.length > 0}
					<form method="POST" action="?/submitForApproval" use:enhance class="pt-4 border-t border-slate-100">
						<button class="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
							<Send size={18} /> Ajukan Untuk Persetujuan
						</button>
						<p class="text-[10px] text-center text-slate-400 mt-3 italic">
							*Data yang diajukan akan direview oleh DPRD.
						</p>
					</form>
				{/if}
			</div>

			<div class="glass p-8 rounded-3xl bg-blue-500/5">
				<h3 class="text-xl font-bold mb-4 flex items-center gap-2">
					<ShoppingBag size={20} class="text-brand-primary" />
					Cek Harga Standar
				</h3>
				<div class="space-y-3">
					{#each data.standardPrices as std}
						<div class="flex justify-between items-center text-sm">
							<span class="text-slate-500">{std.itemName}</span>
							<span class="font-bold text-slate-700">{formatCurrency(std.maxPrice)}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Add Item Modal -->
{#if showAddModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
		<div class="glass max-w-lg w-full p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300">
			<button 
				onclick={() => showAddModal = false}
				class="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
			>
				<XCircle size={24} />
			</button>

			<h2 class="text-2xl font-bold mb-2">Tambah Rincian Anggaran</h2>
			<p class="text-slate-400 text-sm mb-8">Uraian pekerjaaan harus sesuai dengan standar harga daerah.</p>

			<form 
				method="POST" 
				action="?/addItem" 
				use:enhance={() => {
					return ({ result }) => {
						if (result.type === 'success') showAddModal = false;
					};
				}}
				class="space-y-6"
			>
				<div class="space-y-2">
					<label for="itemName" class="text-sm font-semibold text-slate-700 ml-1">Nama Item / Pekerjaan</label>
					<input 
						type="text" 
						list="std-prices"
						name="itemName" 
						id="itemName" 
						placeholder="Misal: Semen (per sak)"
						class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
						required
					/>
					<datalist id="std-prices">
						{#each data.standardPrices as std}
							<option value={std.itemName}></option>
						{/each}
					</datalist>
				</div>

				<div class="grid grid-cols-2 gap-6">
					<div class="space-y-2">
						<label for="unitPrice" class="text-sm font-semibold text-slate-700 ml-1">Harga Satuan (Rp)</label>
						<input 
							type="number" 
							name="unitPrice" 
							id="unitPrice" 
							placeholder="75000"
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>
					<div class="space-y-2">
						<label for="quantity" class="text-sm font-semibold text-slate-700 ml-1">Volume / Jumlah</label>
						<input 
							type="number" 
							name="quantity" 
							id="quantity" 
							placeholder="100"
							class="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
							required
						/>
					</div>
				</div>

				<div class="flex gap-4 pt-4">
					<button 
						type="button"
						onclick={() => showAddModal = false}
						class="flex-1 py-4 glass text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
					>
						Batal
					</button>
					<button 
						type="submit" 
						class="flex-[2] py-4 bg-gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
					>
						Tambahkan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
