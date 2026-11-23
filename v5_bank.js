/* Carnet B Academy v5 — careful distinction between authored questions and
   context-conditioned exercises. All material is authored for this product;
   no verbatim commercial / official exam-bank text is reproduced. */
const V5_BASE_QUESTION_COUNT=QUESTIONS.length;
const V5_BASE_SCENES=[...SCENARIOS.filter(x=>!['alcohol','documentos','vehiculo'].includes(x.lesson)),...V5_EXTRA_SCENE_ROOTS,...V6_EXTRA_SCENE_ROOTS];
const V5_CONTEXT={
 intersection:[['vía local de Barcelona','un turismo se aproxima desde la derecha','coche'],['cruce estrecho','una motocicleta se acerca','moto'],['cruce con edificios que ocultan la vista','un vehículo aparece a corta distancia','coche'],['intersección junto a un colegio','se aproxima un usuario vulnerable','peaton'],['cruce de barrio','dos coches llegan casi simultáneamente','coche'],['cruce con carril de giro','una bicicleta circula junto al bordillo','bici'],['intersección de doble sentido','una furgoneta tapa parte del cruce','furgoneta'],['calle con poca visibilidad','un ciclomotor se aproxima desde un lateral','moto'],['cruce urbano lluvioso','la adherencia es reducida','coche'],['cruce en hora punta','el tráfico ralentiza las maniobras','coche']],
 roundabout:[['glorieta de dos carriles','un turismo ya circula por el anillo','coche'],['glorieta junto a una vía ciclista','una bicicleta ya circula en la glorieta','bici'],['glorieta con entrada estrecha','una furgoneta llega desde el anillo','furgoneta'],['glorieta con salida próxima','un turismo ocupa el carril exterior','coche'],['glorieta en zona comercial','un peatón se acerca al paso de la salida','peaton'],['glorieta con tráfico intenso','dos vehículos se aproximan por tu izquierda','coche'],['glorieta de carril único','una motocicleta ya está circulando','moto'],['glorieta de madrugada','la iluminación limita la visibilidad','coche'],['glorieta bajo lluvia','la calzada está resbaladiza','coche'],['glorieta urbana con autobús','un autobús ocupa el carril exterior','bus']],
 crossing:[['paso escolar','un niño se aproxima al bordillo','peaton'],['paso urbano','una persona está cruzando','peaton'],['paso cercano a un autobús','un peatón aparece al bajar','peaton'],['paso parcialmente oculto','un vehículo estacionado limita la visión','coche'],['paso con movilidad reducida','una persona tarda más en cruzar','peaton'],['paso en lluvia','la distancia de frenado aumenta','peaton'],['paso al salir de una glorieta','una familia espera junto al bordillo','peaton'],['paso urbano de noche','la iluminación es escasa','peaton'],['paso en zona comercial','varios peatones llegan al mismo tiempo','peaton'],['paso con ciclistas cerca','un ciclista se aproxima a la zona','bici']],
 cycle:[['carril bici protegido','un ciclista circula por la derecha','bici'],['carril bici junto a aparcamientos','un ciclista se aproxima a una puerta','bici'],['calzada de un carril','un grupo de ciclistas avanza delante','bici'],['calzada de dos carriles','un ciclista circula junto al borde','bici'],['glorieta urbana','una bicicleta ya circula por el anillo','bici'],['cruce con vía ciclista','un ciclista atraviesa el itinerario de giro','bici'],['calle estrecha','un ciclista puede desplazarse para evitar un bache','bici'],['calle de tráfico calmado','una bicicleta se aproxima por un lateral','bici'],['zona de adelantamiento','un ciclista ocupa el mismo carril','bici'],['calzada mojada','la bicicleta puede perder estabilidad','bici']],
 traffic:[['semáforo urbano','el tráfico se encuentra detenido','coche'],['cruce semaforizado','un ciclista espera junto al semáforo','bici'],['semáforo de tres luces','una motocicleta se acerca al cruce','moto'],['paso con semáforo','una persona espera en el borde','peaton'],['cruce con agente','un agente dirige el tráfico','agente'],['semáforo bajo lluvia','aumenta la distancia para detenerse','coche'],['semáforo con carril reservado','un autobús circula cerca','bus'],['cruce con tranvía','un tranvía ocupa parte de la intersección','tram'],['semáforo en hora punta','el tráfico bloquea la salida','coche'],['semáforo antes de una curva','la señal se ve tarde','coche']],
 parking:[['plaza en línea','hay un turismo estacionado detrás','coche'],['aparcamiento en batería','un coche maniobra junto a ti','coche'],['zona de carga y descarga','una furgoneta realiza una operación','furgoneta'],['calle con carril bici','una bicicleta pasa junto a tu puerta','bici'],['salida de garaje','un peatón camina sobre la acera','peaton'],['calle estrecha','un autobús necesita espacio para pasar','bus'],['zona escolar','un niño puede aparecer entre coches','peaton'],['calle en pendiente','el coche puede moverse si no se inmoviliza bien','coche'],['zona de estacionamiento nocturno','la visibilidad es reducida','coche'],['calle con dos sentidos','un turismo se aproxima en sentido contrario','coche']],
 highway:[['autovía de dos carriles','un turismo circula delante','coche'],['autovía con incorporación','una furgoneta se aproxima por el ramal','furgoneta'],['autovía junto a una salida','un turismo cambia de carril','coche'],['carretera convencional','una motocicleta circula a velocidad distinta','moto'],['carretera con tráfico pesado','un camión reduce la visión','camion'],['autopista con lluvia','la distancia de frenado aumenta','coche'],['carretera nocturna','los faros pueden deslumbrar','coche'],['vía con obras','un vehículo de mantenimiento está presente','camion'],['autovía congestionada','se aproxima un vehículo prioritario','ambulancia'],['vía interurbana con viento','un vehículo voluminoso cambia ligeramente de trayectoria','camion']],
 motorway:[],urban:[],rain:[],snow:[],tram:[],breakdown:[],jam:[]
};
V5_CONTEXT.motorway=V5_CONTEXT.highway;
V5_CONTEXT.urban=V5_CONTEXT.intersection;
V5_CONTEXT.rain=V5_CONTEXT.highway.map(x=>[x[0]+' con pavimento húmedo',x[1],'coche']);
V5_CONTEXT.snow=V5_CONTEXT.highway.map(x=>[x[0]+' con nieve o hielo',x[1],'coche']);
V5_CONTEXT.tram=V5_CONTEXT.traffic.map(x=>[x[0]+' próximo a las vías del tranvía',x[1],'tram']);
V5_CONTEXT.breakdown=V5_CONTEXT.highway.map(x=>[x[0]+' ante una incidencia en la vía',x[1],'averiado']);
V5_CONTEXT.jam=V5_CONTEXT.highway.map(x=>[x[0]+' en circulación densa',x[1],'ambulancia']);
const V5_HAZARD_LABELS={
 coche:'La trayectoria del turismo y el espacio de frenado',moto:'La aproximación y posición de la motocicleta',
 peaton:'La intención de cruce de los peatones',bici:'La trayectoria y el equilibrio de la bicicleta',
 furgoneta:'La visibilidad y tamaño de la furgoneta',camion:'Los ángulos muertos del vehículo pesado',
 bus:'El espacio de maniobra del autobús',agente:'La indicación del agente que regula el tráfico',
 tram:'El movimiento del tranvía sobre sus vías',ambulancia:'El paso seguro del vehículo de emergencia',
 averiado:'La presencia de un vehículo inmovilizado'
};
const V5_RU_HAZARDS={coche:'траекторию машины и тормозной путь',moto:'положение и приближение мотоцикла',peaton:'намерение пешехода перейти дорогу',bici:'траекторию и равновесие велосипеда',furgoneta:'габариты и ограничение обзора из-за фургона',camion:'слепые зоны грузовика',bus:'траекторию автобуса',agente:'указания регулировщика',tram:'движение трамвая по рельсам',ambulancia:'проезд спецтранспорта',averiado:'неподвижный автомобиль'};
const V5_GENERAL_DISTRACTORS=['La marca o el color del coche que conduces','El modelo de la radio y el sistema multimedia','La preferencia personal por una ruta más corta'];
const V5_NEW_SCENES=[];
for(let n=0;n<10;n++){
 for(const [i,seed] of V5_BASE_SCENES.entries()){
 const ctx=V5_CONTEXT[seed.type]||V5_CONTEXT.highway;
  const [place,notice,defaultActor]=ctx[n];
  const topicWords=(seed.name+' '+seed.question).toLowerCase();
  const actor= /tranvía|tranvia/.test(topicWords)?'tram':/ciclist|biciclet|carril bici/.test(topicWords)?'bici':
  /peatón|peatones|niño|niña|menor|persona mayor/.test(topicWords)?'peaton':
  /agente de tráfico|agente de trafico|agente te ordena/.test(topicWords)?'agente':
  /vehículo averiado|turismo inmovilizado|avería/.test(topicWords)?'averiado':
  /ambulancia|vehículo prioritario|emergencias detrás/.test(topicWords)?'ambulancia':
  /camión/.test(topicWords)?'camion':defaultActor;
  const sp={...seed,id:`v5-${String(i+1).padStart(3,'0')}-${String(n+1).padStart(2,'0')}`,
   name:`${seed.name} · ${String(n+1).padStart(2,'0')}`,
   ru:`Контекст: ${place}. ${seed.ru||''}`,
   context:`${place}; ${notice}`,
   question:`${seed.question} Contexto: ${place}; ${notice}.`,
   scene3d:{seedIndex:i,variant:n,actor,type:seed.type,place,notice,weather:n===7?'noche':n===8?'lluvia':'normal',traffic:n===5?'denso':'normal',seed:i*71+n*37},
   originalSeedId:seed.id,caseFamily:seed.id,source:seed.source||'rules'};
  V5_NEW_SCENES.push(sp);
 }
}
// Replace the old 100 with 1000 interactive, 3D-renderable configurations;
// these 1000 inherit 100 authored decision roots, transparently marked.
SCENARIOS.splice(0,SCENARIOS.length,...V5_NEW_SCENES);
const V5_EXERCISES=[];
const V5_QUESTION_KINDS=['decision','hazard','principle'];
for(const [i,s] of SCENARIOS.entries()){
 const actor=s.scene3d.actor,hazard=V5_HAZARD_LABELS[actor]||V5_HAZARD_LABELS.coche;
 const seed=V5_BASE_SCENES[s.scene3d.seedIndex];
 const qs=[
  {q:`${s.question}`,options:[...s.answers],answer:s.correct,ru:s.ruWhy,objective:'decisión táctica'},
  {q:`Durante «${seed.name.toLowerCase()}» en ${s.scene3d.place}, ¿qué debes observar de manera especial cuando ${s.scene3d.notice}?`,
   options:[hazard,'Las plazas de aparcamiento situadas después del conflicto','La información del siguiente destino del navegador'],answer:0,
   ru:`Главная опасность: отслеживай ${V5_RU_HAZARDS[actor]||'опасных участников движения'}.`,objective:'percepción del riesgo'},
  {q:`En «${seed.name.toLowerCase()}» (${s.scene3d.place}), ¿qué respuesta refleja el criterio seguro para esta situación?`,
   options:[seed.answers[seed.correct],'Si se indica con el intermitente, no hace falta comprobar la vía','Los vehículos de mayor tamaño tienen siempre prioridad'],answer:0,
   ru:seed.ruWhy,objective:'aplicación de la norma'}
 ];
 for(let j=0;j<3;j++){
  const x=qs[j];V5_EXERCISES.push({...x,id:`v5q-${i+1}-${j+1}`,lesson:seed.lesson,source:seed.source||'rules',
   family:`v5-${s.originalSeedId}`,sceneId:s.id,contextual:true,original:false,
   kind:V5_QUESTION_KINDS[j],q:x.q,origin:'100 authored decision roots; 10 contexts each'});
 }
}
// Drop v4's 2,608 purely lexical reformulations: they have no new teaching value.
// Base authored questions and 3,000 scenario exercises remain distinct datasets.
// Exclude the paired near-paraphrases in the inherited v3 bank, plus
// four closely overlapping items found in the manual similarity audit.
const V5_REMOVED_IDS=new Set(['x134','x136','v3-17-1','v5review-040']);
const V5_CORE_QUESTIONS=QUESTIONS.filter(q=>!/^v3-\d+-2$/.test(q.id)&&!V5_REMOVED_IDS.has(q.id));
const amber=V5_CORE_QUESTIONS.find(q=>q.id==='q32');if(amber)amber.q='Ante una luz amarilla fija del semáforo, ¿qué debes hacer?';
const belt=V5_CORE_QUESTIONS.find(q=>q.id==='v3-118-1');if(belt){belt.options[belt.answer]='Sí, debes utilizarlo conforme a la normativa';belt.options=belt.options.map(x=>x==='Sí, no hace falta en distancias cortas.'?'No, en distancias cortas deja de ser obligatorio':x);}
const closedLane=V5_CORE_QUESTIONS.find(q=>q.id==='v3-68-1');if(closedLane)closedLane.options[closedLane.answer]='Respetar el cierre y utilizar los carriles habilitados';
const maskedSign=V5_CORE_QUESTIONS.find(q=>q.id==='v3-102-1');if(maskedSign)maskedSign.options[maskedSign.answer]='Evitar estacionar donde obstaculices la visibilidad de señales';
// Mock tests use ONLY independent-core entries. The 3,000 multi-angle
// exercises belong to the scenario classroom, NOT the 30-question mock exam.
QUESTIONS.splice(0,QUESTIONS.length,...V5_CORE_QUESTIONS);
const V5_GLOSS_FAMILIES=new Map();
for(const q of QUESTIONS){const key=q.lesson+'|'+q.ru.trim().toLowerCase();
  if(!V5_GLOSS_FAMILIES.has(key))V5_GLOSS_FAMILIES.set(key,q.id);
  q.family=q.family||V5_GLOSS_FAMILIES.get(key);
}
const V5_COUNTS={core:V5_CORE_QUESTIONS.length,sceneExercises:V5_EXERCISES.length,
 scenes:SCENARIOS.length,rootScenes:V5_BASE_SCENES.length,
 familyCount:new Set(QUESTIONS.map(q=>q.family||q.variantOf||q.ruleId||q.id.replace(/-(1|2)$/,'-root'))).size,
 total:V5_CORE_QUESTIONS.length+V5_EXERCISES.length,editorialDate:'2026-11-23'};
// Compatibility with prior UI wording; headline text updated in app.js.
const V4_COUNTS={items:V5_COUNTS.total,families:V5_COUNTS.familyCount,scenarios:SCENARIOS.length};
