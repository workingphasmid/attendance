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
        } catch (e) {
            setUser(null);
            setError("Lookup failed.");
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

            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-xl font-bold mb-4">Scan QR Code</h1>

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
                    <div className="mt-4 p-4 border rounded">
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

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {scanned && (
                    <button
                        onClick={reset}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Scan again
                    </button>
                )}
            </div>
        </>
    );
}
