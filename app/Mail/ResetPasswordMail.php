<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombreUsuario;
    public string $nombreFinca;
    public string $resetUrl;

    public function __construct(string $nombreUsuario, string $nombreFinca, string $resetUrl)
    {
        $this->nombreUsuario = $nombreUsuario;
        $this->nombreFinca   = $nombreFinca;
        $this->resetUrl      = $resetUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Restablecer contraseña — SGDB Cow Farm',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
        );
    }
}