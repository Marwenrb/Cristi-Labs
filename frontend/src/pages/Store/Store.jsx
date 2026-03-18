import Footer from "../../components/Footer/Footer";

const Store = () => {
    return (
        <div>
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <div className="p-4 flex flex-col md:justify-center h-full">
                        <div className="relative flex flex-col justify-center items-start md:pl-12 pl-4">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
                                Premium Access
                            </p>
                            <h1
                                className="text-[var(--text-primary)] text-6xl md:text-8xl lg:text-[10rem] tracking-wider leading-[0.9]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                The Vault
                            </h1>
                            <p className="mt-8 text-[var(--text-secondary)] text-sm md:text-base max-w-lg tracking-wide">
                                Curated commerce. Exclusive access. Coming soon.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Store;
