<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Finca extends Model
{
    protected $table = 'fincas';

    protected $fillable = [
        'codigo_finca',
        'nombre',
        'password',
        'logo_url',
        'direccion',
        'propietario',
        'telefono',
        'activo',
    ];

    protected $hidden = [
        'password',
    ];

    // Relaciones
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'finca_id');
    }

    public function bovinos()
    {
        return $this->hasMany(Bovino::class, 'finca_id');
    }

    public function lotes()
    {
        return $this->hasMany(Lote::class, 'finca_id');
    }
}