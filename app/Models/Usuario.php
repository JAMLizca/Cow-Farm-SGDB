<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $fillable = [
        'finca_id',
        'nombre',
        'email',
        'password',
        'rol',
        'activo',
    ];

    protected $hidden = [
        'password',
    ];

    // Relaciones
    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function produccionLeche()
    {
        return $this->hasMany(ProduccionLeche::class, 'usuario_id');
    }

    public function pesajes()
    {
        return $this->hasMany(Pesaje::class, 'usuario_id');
    }

    public function eventosSanitarios()
    {
        return $this->hasMany(EventoSanitario::class, 'usuario_id');
    }

    public function alimentacion()
    {
        return $this->hasMany(Alimentacion::class, 'usuario_id');
    }
}