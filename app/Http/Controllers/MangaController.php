<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manga;

class MangaController extends Controller
{
    public function index() {
        return Manga::all();
    }

    public function store(Request $request) {
        $manga = new Manga();
        $manga->titulo = $request->titulo;
        $manga->autor = $request->autor;
        $manga->url_portada = $request->url_portada;
        $manga->estado = $request->estado;
        
        // Volúmenes
        $manga->volumen_actual = $request->volumen_actual;
        $manga->volumenes_totales = $request->volumenes_totales;
        
        // Capítulos (NUEVO)
        $manga->capitulo_actual = $request->capitulo_actual;
        $manga->capitulos_totales = $request->capitulos_totales;

        $manga->save();
        return $manga;
    }

    public function update(Request $request, $id) {
        $manga = Manga::find($id);
        if ($manga) {
            // Actualizamos solo lo que nos manden
            if ($request->has('volumen_actual')) $manga->volumen_actual = $request->input('volumen_actual');
            if ($request->has('capitulo_actual')) $manga->capitulo_actual = $request->input('capitulo_actual'); // NUEVO
            if ($request->has('estado')) $manga->estado = $request->input('estado');
            
            $manga->save();
            return response()->json($manga);
        }
        return response()->json(['mensaje' => 'No encontrado'], 404);
    }

    public function destroy($id) {
        $manga = Manga::find($id);
        if ($manga) {
            $manga->delete();
            return response()->json(['mensaje' => 'Eliminado']);
        }
        return response()->json(['mensaje' => 'No encontrado'], 404);
    }
}