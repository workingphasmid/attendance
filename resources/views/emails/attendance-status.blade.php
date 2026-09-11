<x-mail::message>
    # Attendance Update

    Hi {{ $user->name }},

    You were marked **{{ strtoupper($status) }}** at {{ now()->setTimezone('Asia/Manila')->format('g:i A, M j') }}·

    Thanks,
    {{ config('app.name') }}
</x-mail::message>