/* Carnet B Academy v7: keep editorial origins transparent. Mixed contextual items
   are not described as 2455 individually authored new traffic-law principles. */
const V7_COUNTS={core:545,contextual:V7_CONTEXTUAL_CASES.length,scenarioScripts:V7_SCRIPTED_SCENES.length,flashcardsNew:V7_CARDS.length,manualRoots:112};
QUESTIONS.push(...V7_CONTEXTUAL_CASES);
EXTRA_FLASHCARDS.push(...V7_CARDS);
for(const sc of V7_SCRIPTED_SCENES){
  SCENARIOS.push(sc);
  const hz={
   peaton:'El recorrido de una persona que puede cruzar',
   bici:'La trayectoria lateral de la bicicleta y su margen',
   ambulancia:'El paso libre necesario para el vehículo urgente',
   agente:'El gesto del agente y la señal a la que sustituye',
   averiado:'La posición del vehículo inmovilizado y personas cerca',
   coche:'La prioridad, la trayectoria y el espacio disponible'
  }[sc.scene3d.actor]||'La posición del otro usuario y el espacio libre';
  V5_EXERCISES.push({id:sc.id+'-hazard',sceneId:sc.id,kind:'hazard',q:'Antes de decidir, ¿qué debes observar especialmente en esta escena?',
   options:[hz,'El color y la marca comercial de los vehículos','La ruta más corta indicada por el navegador'],answer:0,
   ru:'Сосредоточь внимание на действиях и положении другого участника движения.'});
  V5_EXERCISES.push({id:sc.id+'-rule',sceneId:sc.id,kind:'principle',q:'¿Cuál es el fundamento de la respuesta correcta para esta situación?',
   options:[sc.why,'Poner el intermitente siempre concede prioridad','Quien circula más rápido tiene derecho de paso'],answer:0,
   ru:sc.ruWhy});
}
V5_COUNTS.core=QUESTIONS.length;
V5_COUNTS.scenes=SCENARIOS.length;
V5_COUNTS.sceneExercises=V5_EXERCISES.length;
V5_COUNTS.familyCount=new Set(QUESTIONS.map(q=>q.family||q.id)).size;
V5_COUNTS.total=QUESTIONS.length+V5_EXERCISES.length;
V5_COUNTS.editorialDate='2026-11-23';
