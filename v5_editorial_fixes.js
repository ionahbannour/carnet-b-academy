/* v5.1 editorial pass: answer/question coherence repairs from examiner-style audit.
   Corrections are explicit, traceable, and do NOT add new question counts. */
const V5_EDITORIAL_REPAIRS = [
 ['v3-9-1','¿Está permitido atravesar una línea longitudinal continua ordinaria para adelantar?',null],
 ['v3-14-1','En una obra, una marca amarilla provisional contradice una blanca permanente. ¿Qué trazado debes seguir?',null],
 ['v3-19-1','Al salir de una propiedad privada a la vía pública, ¿a quién debes ceder el paso?',null],
 ['v3-30-1','El semáforo está verde, pero hay usuarios atravesando el cruce. ¿Cómo debes actuar?',null],
 ['v3-40-1','Si aumenta tu tiempo de reacción, ¿qué sucede con la distancia total de detención?',null],
 ['v3-42-1','Circulas por una calle limitada genéricamente a 50 km/h y una señal fija indica 30. ¿Qué máximo debes respetar?',null],
 ['v3-43-1','Te acercas a una curva con visibilidad reducida. ¿Qué debes hacer con la velocidad antes de entrar?','Reducir la velocidad previamente para mantener el control'],
 ['v3-44-1','¿Basta con circular por debajo del límite máximo para llevar siempre una velocidad segura?',null],
 ['v3-49-1','¿Qué comunicas a los demás mediante el intermitente antes de una maniobra?','Tu intención de maniobrar; el intermitente no concede prioridad'],
 ['v3-52-1','¿Qué debes comprobar antes de abrir la puerta de un coche estacionado?','Si se aproximan ciclistas, motocicletas u otros usuarios'],
 ['v3-58-1','Con niebla intensa y visibilidad insuficiente, ¿es prudente iniciar un adelantamiento?',null],
 ['v3-60-1','¿Qué debes comprobar después de completar un cambio de dirección?','Que el indicador de dirección se haya cancelado'],
 ['v3-62-1','¿Dónde debes reducir la velocidad para abandonar correctamente una autopista?','En el carril de deceleración, con seguridad'],
 ['v3-71-1','¿Qué debes observar para circular por un carril reversible?','La señalización específica del carril'],
 ['v3-75-1','¿En qué momento conviene reducir la velocidad ante una curva pronunciada?',null],
 ['v3-79-1','¿Puedes circular en la dirección indicada por una flecha roja iluminada en un semáforo?','No, en la dirección indicada por la flecha roja'],
 ['v3-80-1','El semáforo te permite avanzar, pero un agente te ordena parar. ¿Qué orden prevalece?',null],
 ['v3-87-1','¿A quién se dirige un semáforo que muestra una silueta de bicicleta?',null],
 ['v3-89-1','Ante un semáforo rojo, ¿dónde debes detenerte con respecto a la línea de detención?',null],
 ['v3-91-1','Inmovilizas voluntariamente el turismo durante más de dos minutos, sin emergencia. ¿Cómo se clasifica en general?',null],
 ['v3-97-1','¿Cuándo puedes abrir una puerta junto a una vía ciclista?',null],
 ['v3-99-1','Si aparcar en doble fila obstruye la circulación, ¿qué alternativa debes elegir?',null],
 ['v3-100-1','Un conductor abandona voluntariamente el coche inmovilizado menos de dos minutos. ¿Sigue considerándose una parada reglamentaria?',null],
 ['v3-101-1','¿Puedes ocupar una reserva de carga y descarga con tu turismo sin autorización fuera de las condiciones señalizadas?',null],
 ['v3-108-1','¿Para qué sirve ajustar correctamente el reposacabezas?',null],
 ['v3-112-1','¿Qué efecto principal tiene el sistema ABS durante una frenada intensa?',null],
 ['v3-113-1','¿Cuál es la distancia de seguridad adecuada detrás de otro vehículo?',null],
 ['v3-117-1','¿Qué efecto tienen unos neumáticos con agarre insuficiente durante la frenada?','Disminuye la adherencia y aumenta el riesgo'],
 ['v3-120-1','¿Qué debes hacer con la velocidad al circular de noche si solo puedes ver hasta cierta distancia?',null],
 ['v3-133-1','¿Qué conducta representa una distracción peligrosa aunque el coche esté detenido ante un semáforo?',null],
 ['v3-134-1','¿Cómo debes organizar los descansos en un desplazamiento largo?',null],
 ['v3-137-1','¿Cuál es la profundidad mínima legal general del dibujo del neumático de un turismo?','1,6 mm'],
 ['v3-138-1','Si se enciende el testigo rojo de presión de aceite, ¿qué acción prudente debes realizar?',null],
 ['v3-139-1','¿Qué elementos te permiten observar el tráfico de atrás, complementados con la observación directa?',null],
 ['v3-140-1','¿Cuál es la función principal del ABS durante una frenada intensa?',null],
 ['v3-141-1','¿En qué sistema se utiliza el líquido de frenos?',null],
 ['v3-143-1','¿En qué sistema se utiliza el refrigerante del motor?',null],
 ['v3-144-1','Detectas una vibración anormal al frenar. ¿Qué medida es prudente adoptar?',null],
 ['v3-147-1','¿Qué dispositivo mantiene inmovilizado un coche cuando está aparcado?',null],
 ['v3-148-1','¿Qué luces indican a otros usuarios que vas a girar?',null],
 ['v3-150-1','¿Qué componentes deben revisarse cuando notas una amortiguación defectuosa?',null],
 ['v3-157-1','¿Qué debes comprobar respecto a la fecha de la ITV de tu turismo?',null],
 ['v3-158-1','¿Puedes circular con un permiso de conducción que ha perdido su vigencia?',null],
 ['v3-160-1','¿Qué normas debes consultar para entrar legalmente en una Zona de Bajas Emisiones municipal?',null],
 ['v3-161-1','Cuando te retiran puntos por una infracción, ¿qué dato se reduce?',null],
 ['v3-163-1','¿Cómo debes actuar cuando un agente te solicita la documentación legalmente exigible?',null],
 ['v3-164-1','¿Qué distintivo identifica la clasificación ambiental asignada por la DGT?',null],
 ['v3-165-1','¿Qué debes hacer si tu permiso de conducir alcanza la fecha de caducidad?',null],
 ['v3-168-1','¿Qué debes hacer con una persona herida tras un siniestro si no existe peligro inminente?',null],
 ['v3-192-1','¿Cómo se llama la pérdida de adherencia sobre una película de agua, cuando las ruedas dejan de contactar adecuadamente con la calzada?',null],
 ['v3-201-1','¿Qué velocidad máxima debes respetar cuando un panel luminoso muestra una limitación variable?',null],
 ['v3-207-1','¿La sensación subjetiva de sobriedad garantiza que no des positivo en un control de alcohol?',null],
 ['v3-209-1','Antes de conducir de noche, detectas que el alumbrado obligatorio no funciona. ¿Qué debes hacer?',null],
 ['v3-210-1','¿Permiten los sistemas ADAS desatender la conducción porque controlan todos los riesgos?',null]
];
const V5_REPAIR_OPTION_OVERRIDES={
 'v3-137-1':['1,6 mm','1,0 mm','0,5 mm'],
 'v3-147-1':['El claxon','El freno de estacionamiento','El intermitente'],
 'v3-148-1':['Las luces de carretera','El alumbrado de matrícula','Los intermitentes'],
 'v3-192-1':['El subviraje','Aquaplaning','El efecto túnel'],
 'v3-112-1':['Aumenta la velocidad máxima','Elimina toda necesidad de distancia de seguridad','Ayuda a evitar el bloqueo de las ruedas'],
 'v3-207-1':['Sí, si caminas recto','No, la sensación subjetiva no garantiza aptitud ni alcoholemia legal','Sí, si puedes hablar bien']
};
let V5_REPAIRS_APPLIED=0;
for(const [id,stem,correctText] of V5_EDITORIAL_REPAIRS){
 const q=QUESTIONS.find(x=>x.id===id);if(!q)continue;
 q.q=stem;if(correctText)q.options[q.answer]=correctText;
 if(V5_REPAIR_OPTION_OVERRIDES[id])q.options=[...V5_REPAIR_OPTION_OVERRIDES[id]];
 q.editorialReview='stem-answer alignment v5.1';V5_REPAIRS_APPLIED++;
}
// Do not let app-meta questions, regulatory enactment trivia, or semantic
// near-duplicates inflate the simulated DGT examination catalogue.
const V5_EDITORIAL_EXCLUSIONS=[
 'x128','x132','upd26-3','v3-212-1',
 'v3-3-1','v3-7-1','v3-9-1','v3-16-1',
 'v3-31-1','v3-32-1','v3-33-1','v3-34-1',
 'v3-92-1','v3-166-1','v3-170-1','v3-171-1','v3-194-1',
 'v3-196-1','v3-214-1','v3-216-1',
 'x97','x98','v3-1-1','v5review-041'
];
for(const id of V5_EDITORIAL_EXCLUSIONS){const index=QUESTIONS.findIndex(x=>x.id===id);if(index>=0)QUESTIONS.splice(index,1)}
V5_COUNTS.core=QUESTIONS.length;
V5_COUNTS.total=QUESTIONS.length+V5_EXERCISES.length;
V5_COUNTS.familyCount=new Set(QUESTIONS.map(q=>q.family||q.variantOf||q.ruleId||q.id)).size;
V4_COUNTS.items=V5_COUNTS.total;V4_COUNTS.families=V5_COUNTS.familyCount;
