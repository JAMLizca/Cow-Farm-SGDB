<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventoSanitario;
use Illuminate\Support\Facades\Validator;

class EventoSanitarioController extends Controller
{
    // Listar todos los eventos de una finca
    public function index(Request $request)
    {
        $eventos = EventoSanitario::with(['bovino', 'usuario'])
                                   ->where('finca_id', $request->finca_id)
                                   ->orderBy('fecha', 'desc')
                                   ->get();

        return response()->json($eventos, 200);
    }

    // Mostrar un evento
    public function show($id)
    {
        $evento = EventoSanitario::with(['bovino', 'usuario'])
                                  ->find($id);

        if (!$evento) {
            return response()->json([
                'message' => 'Evento no encontrado'
            ], 404);
        }

        return response()->json($evento, 200);
    }

    // Registrar un evento
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'   => 'required|exists:fincas,id',
            'bovino_id'  => 'required|exists:bovinos,id',
            'usuario_id' => 'required|exists:usuarios,id',
            'tipo'       => 'required|in:Vacunación,Desparasitación,Tratamiento,Revisión',
            'producto'   => 'required|string',
            'fecha'      => 'required|date',
            'estado'     => 'required|in:Programado,Ejecutado,Cancelado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $evento = EventoSanitario::create($request->all());

        return response()->json([
            'message' => 'Evento registrado correctamente',
            'evento'  => $evento
        ], 201);
    }

    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $evento = EventoSanitario::find($id);

        if (!$evento) {
            return response()->json([
                'message' => 'Evento no encontrado'
            ], 404);
        }

        $evento->update($request->all());

        return response()->json([
            'message' => 'Evento actualizado correctamente',
            'evento'  => $evento
        ], 200);
    }

    // Eliminar un evento
    public function destroy($id)
    {
        $evento = EventoSanitario::find($id);

        if (!$evento) {
            return response()->json([
                'message' => 'Evento no encontrado'
            ], 404);
        }

        $evento->delete();

        return response()->json([
            'message' => 'Evento eliminado correctamente'
        ], 200);
    }
}