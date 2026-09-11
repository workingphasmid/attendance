<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\User;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */

    public function run(): void
    {
        $users = [
            ['name' => 'Charles Renan Retes', 'email' => "test@example.com"],
            ['name' => 'Sean Kirby Alipao',  'email' => "test1@example.com"],
        ];

        foreach ($users as $data) {
            $qrCode = (string) Str::uuid(); // this is what gets encoded in the QR

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'qr_code' => $qrCode,
            ]);

            // Optional: save an actual PNG/SVG file to storage
            $svg = QrCode::format('svg')->size(300)->generate($qrCode);
            file_put_contents(storage_path("app/public/qrcodes/{$user->id}.svg"), $svg);
        }
    }
}
