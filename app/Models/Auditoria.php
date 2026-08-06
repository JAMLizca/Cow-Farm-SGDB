<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table = 'auditoria';

    protected $fillable = [
        'finca_id',
        'usuario_id',
        'nombre_usuario',
        'rol_usuario',
        'accion',
        'modulo',
        'descripcion',
        'ip',
    ];

    public function finca()
    {
        return $this->belongsTo(Finca::class, 'finca_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}