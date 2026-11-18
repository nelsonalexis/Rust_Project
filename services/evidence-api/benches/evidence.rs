use std::hint::black_box;

use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion, Throughput};
use drive_escrow_api::fingerprint;

fn sha256(c: &mut Criterion) {
    let mut group = c.benchmark_group("sha256");
    for size in [1024, 1024 * 1024, 8 * 1024 * 1024] {
        let evidence = vec![0x5a; size];
        group.throughput(Throughput::Bytes(size as u64));
        group.bench_with_input(BenchmarkId::from_parameter(size), &evidence, |b, data| {
            b.iter(|| fingerprint(black_box(data)));
        });
    }
    group.finish();
}

fn configuration() -> Criterion {
    let criterion = Criterion::default();
    #[cfg(target_os = "linux")]
    let criterion = criterion.with_profiler(pprof::criterion::PProfProfiler::new(
        100,
        pprof::criterion::Output::Flamegraph(None),
    ));
    criterion
}

criterion_group! { name = benches; config = configuration(); targets = sha256 }
criterion_main!(benches);
