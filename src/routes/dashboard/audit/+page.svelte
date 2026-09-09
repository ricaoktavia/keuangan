<script lang="ts">
	import { 
		LayoutDashboard, 
		Clock, 
		User, 
		Database, 
		Search,
		Eye,
		Activity,
		MoreHorizontal
	} from 'lucide-svelte';
	
	let { data } = $props();
	let selectedLog = $state<any>(null);

	function formatData(data: any) {
		if (!data) return 'None';
		return JSON.stringify(data, null, 2);
	}
</script>

<div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold flex items-center gap-3">
				<Activity class="text-indigo-500" size={36} />
				Audit Trail (Keamanan)
			</h1>
			<p class="text-slate-400 mt-1">Log perubahan data yang tidak dapat diubah (Immutable)</p>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
		<div class="glass p-6 rounded-3xl bg-indigo-50/30 border-indigo-100">
			<p class="text-[10px] text-indigo-400 font-bold uppercase mb-1">Total Logs</p>
			<h3 class="text-2xl font-bold text-indigo-900">{data.logs.length}</h3>
		</div>
		<div class="glass p-6 rounded-3xl bg-emerald-50/30 border-emerald-100">
			<p class="text-[10px] text-emerald-400 font-bold uppercase mb-1">Persetujuan Terakhir</p>
			<div class="text-xs font-bold text-emerald-900 mt-2">Recently Synced</div>
		</div>
		<div class="col-span-2 glass p-6 rounded-3xl flex items-center gap-4">
			<div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
				<Database size={20} />
			</div>
			<p class="text-xs text-slate-500 italic">
				Sistem mencatat: Siapa, Kapan, Data Sebelum, dan Data Sesudah untuk setiap perubahan nominal.
			</p>
		</div>
	</div>

	<!-- Logs Table -->
	<div class="glass rounded-3xl overflow-hidden">
		<table class="w-full text-left">
			<thead class="bg-slate-50/50 border-b border-slate-100">
				<tr>
					<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Aktor</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tabel</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
					<th class="px-6 py-4"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-50">
				{#each data.logs as log}
					<tr class="hover:bg-slate-50/50 transition-all group">
						<td class="px-6 py-5">
							<div class="flex items-center gap-2 text-slate-500 font-medium text-sm">
								<Clock size={14} />
								{log.createdAt ? new Date(log.createdAt).toLocaleString('id-ID') : '-'}
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
									{log.userName?.charAt(0) || '?'}
								</div>
								<span class="text-sm font-semibold text-slate-700">{log.userName || 'System'}</span>
							</div>
						</td>
						<td class="px-6 py-5">
							<span class="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-mono uppercase font-bold">
								{log.tableName}
							</span>
						</td>
						<td class="px-6 py-5">
							<span class="text-xs font-bold uppercase {log.action === 'CREATE' ? 'text-emerald-500' : 'text-indigo-500'}">
								{log.action}
							</span>
						</td>
						<td class="px-6 py-5 text-right">
							<button 
								onclick={() => selectedLog = log}
								class="p-2 text-slate-300 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-all"
							>
								<Eye size={18} />
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="p-20 text-center text-slate-400 italic">
							Belum ada riwayat perubahan terekam.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Modal Detail Log -->
{#if selectedLog}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
		<div class="glass max-w-4xl w-full p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
			<button 
				onclick={() => selectedLog = null}
				class="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
			>
				<MoreHorizontal size={24} />
			</button>

			<h2 class="text-2xl font-bold mb-2">Detail Perubahan Data</h2>
			<p class="text-slate-400 text-sm mb-8">Snapshot data sebelum dan setelah perubahan dilakukan.</p>

			<div class="grid md:grid-cols-2 gap-8">
				<div class="space-y-4">
					<h4 class="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-rose-400"></span>
						Data Sebelum
					</h4>
					<div class="bg-slate-900 rounded-2xl p-6 overflow-auto max-h-[400px]">
						<pre class="text-xs text-indigo-200 font-mono">{formatData(selectedLog.oldData)}</pre>
					</div>
				</div>
				<div class="space-y-4">
					<h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
						Data Sesudah
					</h4>
					<div class="bg-slate-900 rounded-2xl p-6 overflow-auto max-h-[400px]">
						<pre class="text-xs text-indigo-100 font-mono">{formatData(selectedLog.newData)}</pre>
					</div>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-sm">
				<div class="text-slate-400 italic">ID Transaksi: {selectedLog.id}</div>
				<button 
					onclick={() => selectedLog = null}
					class="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
				>
					Tutup Panel
				</button>
			</div>
		</div>
	</div>
{/if}
