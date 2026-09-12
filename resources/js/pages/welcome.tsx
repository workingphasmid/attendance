// resources/js/Pages/Welcome.tsx
import { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { Head } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    status: string;
    email: string;
    qr_code: string;
}

export default function Welcome() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanned, setScanned] = useState(false);

    const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
        if (scanned || detectedCodes.length === 0) return;

        const code = detectedCodes[0].rawValue;
        if (!code) return;

        setScanned(true); // pause further lookups until reset

        try {
            const res = await axios.post<{ user: User | null }>("/scan", {
                code,
            });

            if (res.data.user) {
                setUser(res.data.user);
                setError(null);
            } else {
                setUser(null);
                setError("No user found for this code.");
            }
        } catch (error) {
            setUser(null);
            setError(
                axios.isAxiosError(error) && error.response?.status === 404
                    ? "No user found for this code."
                    : "Lookup failed.",
            );
        }
    };

    const handleError = (err: unknown) => {
        console.error(err);
    };

    const reset = () => {
        setUser(null);
        setError(null);
        setScanned(false);
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="mx-auto max-w-md p-6">
                <h1 className="mb-4 text-xl font-bold">Scan QR Code</h1>

                {!scanned && (
                    <Scanner
                        onScan={handleScan}
                        onError={handleError}
                        formats={["qr_code"]}
                        constraints={{
                            height: { ideal: 1920 },
                            width: { ideal: 1080 },
                        }}
                    />
                )}

                {user && (
                    <div className="mt-4 rounded border p-4">
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Status:</strong> {user.status}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                    </div>
                )}

                {error && <p className="mt-4 text-red-500">{error}</p>}

                {scanned && (
                    <button
                        onClick={reset}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        Scan again
                    </button>
                )}
            </div>
        </>
    );
}
