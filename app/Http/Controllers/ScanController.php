<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Mail\AttendanceStatusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ScanController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome');
    }

    public function find(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = User::where('qr_code', $request->code)->first();

        if (!$user) {
            return response()->json([
                'user' => null,
                'status' => null,
            ], 404);
        }

        $user->update([
            'status' => $user->status === 'out' ? 'in' : 'out',
        ]);

        Log::info('Scan attempt', ['user' => $user]);
        // Queue the email so it doesn't block the scan response
        if ($user->email) {
            Mail::to($user->email)->send(new AttendanceStatusMail($user, $user->status));
        }

        return response()->json([
            'user' => $user,
            'status' => $user->status,
            'email' => $user->email,
        ]);
    }
}
