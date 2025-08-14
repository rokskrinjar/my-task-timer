-- Prevod vseh Sports vprašanj v slovenščino

-- Football vprašanja
UPDATE questions SET 
  question_text = 'Katera država je zmagala na FIFA svetovnem prvenstvu 2018?',
  option_a = 'Brazilija',
  option_b = 'Nemčija', 
  option_c = 'Francija',
  option_d = 'Argentina'
WHERE question_text = 'Which country won the FIFA World Cup in 2018?';

UPDATE questions SET
  question_text = 'Koliko igralcev je na nogometnem igrišču naenkrat v eni ekipi?',
  option_a = '10',
  option_b = '11', 
  option_c = '12',
  option_d = '9'
WHERE question_text = 'How many players are on a football team on the field at one time?';

UPDATE questions SET
  question_text = 'Kakšna je maksimalna dolžina nogometne tekme?',
  option_a = '80 minut',
  option_b = '90 minut',
  option_c = '100 minut', 
  option_d = '120 minut'
WHERE question_text = 'What is the maximum duration of a football match?';

UPDATE questions SET
  question_text = 'Kdo je znan kot "Kralj nogometa"?',
  option_a = 'Maradona',
  option_b = 'Pelé',
  option_c = 'Ronaldo',
  option_d = 'Messi'
WHERE question_text = 'Who is known as the "King of Football"?';

UPDATE questions SET
  question_text = 'Katera država je gostila FIFA svetovno prvenstvo 2022?',
  option_a = 'Rusija',
  option_b = 'Katar',
  option_c = 'Brazilija',
  option_d = 'Nemčija'
WHERE question_text = 'Which country hosted the 2022 FIFA World Cup?';

-- Basketball vprašanja  
UPDATE questions SET
  question_text = 'Koliko igralcev ima košarkarska ekipa na igrišču naenkrat?',
  option_a = '4',
  option_b = '5',
  option_c = '6', 
  option_d = '7'
WHERE question_text = 'How many players does a basketball team have on the court at one time?';

UPDATE questions SET
  question_text = 'Koliko točk vredno je meta z razdalje v košarki?',
  option_a = '1 točka',
  option_b = '2 točki',
  option_c = '3 točke',
  option_d = '4 točke'
WHERE question_text = 'How many points is a three-point shot worth in basketball?';

UPDATE questions SET
  question_text = 'Kateri igralec ima največ NBA naslovov prvaka?',
  option_a = 'Michael Jordan',
  option_b = 'Bill Russell',
  option_c = 'LeBron James',
  option_d = 'Kobe Bryant'
WHERE question_text = 'Which player has the most NBA championship titles?';

UPDATE questions SET
  question_text = 'Kako visok je košarkarski koš?',
  option_a = '2.5 metra',
  option_b = '3.05 metra',
  option_c = '3.5 metra',
  option_d = '4 metra'
WHERE question_text = 'How tall is a basketball hoop?';

UPDATE questions SET
  question_text = 'Katera liga je znana kot NBA?',
  option_a = 'Nacionalna košarkarska zveza',
  option_b = 'Narodna košarkarska liga',
  option_c = 'Severna ameriška košarka',
  option_d = 'Nova ameriška košarka'
WHERE question_text = 'Which league is known as the NBA?';

-- Tennis vprašanja
UPDATE questions SET
  question_text = 'Koliko setov mora zmagati igralec, da zmaga na Wimbledonu (moški)?',
  option_a = '2',
  option_b = '3',
  option_c = '4',
  option_d = '5'
WHERE question_text = 'How many sets must a player win to win Wimbledon (men''s)?';

UPDATE questions SET
  question_text = 'Kateri turnir NI del Grand Slam?',
  option_a = 'Wimbledon',
  option_b = 'Masters 1000 v Madridu',
  option_c = 'US Open',
  option_d = 'Roland Garros'
WHERE question_text = 'Which tournament is NOT part of the Grand Slam?';

UPDATE questions SET
  question_text = 'Kaj pomeni "Love" v tenisu?',
  option_a = '15 točk',
  option_b = '30 točk',
  option_c = '0 točk',
  option_d = '40 točk'
WHERE question_text = 'What does "Love" mean in tennis?';

UPDATE questions SET
  question_text = 'Na kateri podlagi se igra Roland Garros?',
  option_a = 'Trava',
  option_b = 'Ilovica',
  option_c = 'Trd',
  option_d = 'Umetna trava'
WHERE question_text = 'What surface is Roland Garros played on?';

UPDATE questions SET
  question_text = 'Kdo drži rekord za največ Grand Slam naslovov (ženske)?',
  option_a = 'Steffi Graf',
  option_b = 'Serena Williams',
  option_c = 'Margaret Court',
  option_d = 'Martina Navratilova'
WHERE question_text = 'Who holds the record for most Grand Slam titles (women)?';

-- Olympics vprašanja
UPDATE questions SET
  question_text = 'Kje so bile zadnje olimpijske igre?',
  option_a = 'Rio de Janeiro',
  option_b = 'Tokio',
  option_c = 'Peking',
  option_d = 'Pariz'
WHERE question_text = 'Where were the last Olympic Games held?';

UPDATE questions SET
  question_text = 'Koliko olimpijskih obročev je na olimpijski zastavi?',
  option_a = '4',
  option_b = '5',
  option_c = '6',
  option_d = '7'
WHERE question_text = 'How many Olympic rings are on the Olympic flag?';

UPDATE questions SET
  question_text = 'Katera država je gostila prve moderne olimpijske igre?',
  option_a = 'Francija',
  option_b = 'Grčija',
  option_c = 'Italija',
  option_d = 'Velika Britanija'
WHERE question_text = 'Which country hosted the first modern Olympic Games?';

UPDATE questions SET
  question_text = 'Kateri šport ni del poletnih olimpijskih iger?',
  option_a = 'Plavanje',
  option_b = 'Atletika',
  option_c = 'Biatlonski tek',
  option_d = 'Gimnastika'
WHERE question_text = 'Which sport is not part of the Summer Olympics?';

UPDATE questions SET
  question_text = 'Kdo je najhitrejši človek na svetu?',
  option_a = 'Carl Lewis',
  option_b = 'Usain Bolt',
  option_c = 'Jesse Owens',
  option_d = 'Justin Gatlin'
WHERE question_text = 'Who is the fastest man in the world?';

-- Swimming vprašanja
UPDATE questions SET
  question_text = 'Kateri je najhitrejši plavalni slog?',
  option_a = 'Prosto',
  option_b = 'Hrbtno',
  option_c = 'Prsno',
  option_d = 'Delfin'
WHERE question_text = 'Which is the fastest swimming stroke?';

UPDATE questions SET
  question_text = 'Koliko meter je standardna olimpijska plavalna steza?',
  option_a = '25 metrov',
  option_b = '50 metrov',
  option_c = '75 metrov',
  option_d = '100 metrov'
WHERE question_text = 'How many meters is a standard Olympic swimming pool lane?';

UPDATE questions SET
  question_text = 'Kdo drži svetovno rekorde v plavanju z največ olimpijskimi medaljami?',
  option_a = 'Mark Spitz',
  option_b = 'Michael Phelps',
  option_c = 'Ian Thorpe',
  option_d = 'Katie Ledecky'
WHERE question_text = 'Who holds the most Olympic swimming medals record?';

UPDATE questions SET
  question_text = 'Kateri plavalni slog se izvaja na hrbtu?',
  option_a = 'Prosto',
  option_b = 'Hrbtno',
  option_c = 'Prsno',
  option_d = 'Delfin'
WHERE question_text = 'Which swimming stroke is performed on the back?';

UPDATE questions SET
  question_text = 'Koliko plavalnih slogov je v mešanem štafetnem plav?',
  option_a = '2',
  option_b = '3',
  option_c = '4',
  option_d = '5'
WHERE question_text = 'How many swimming strokes are in an individual medley?';

-- Athletics vprašanja
UPDATE questions SET
  question_text = 'Koliko meter je maratonska razdalja?',
  option_a = '40.195 m',
  option_b = '42.195 m',
  option_c = '44.195 m',
  option_d = '46.195 m'
WHERE question_text = 'How many meters is a marathon distance?';

UPDATE questions SET
  question_text = 'Katera atletska disciplina vključuje met kladiva?',
  option_a = 'Skok v višino',
  option_b = 'Met kopja',
  option_c = 'Met kladiva',
  option_d = 'Skok s palico'
WHERE question_text = 'Which track and field event involves throwing a hammer?';

UPDATE questions SET
  question_text = 'Koliko ovir je v teku čez ovire na 110 metrov (moški)?',
  option_a = '8',
  option_b = '10',
  option_c = '12',
  option_d = '15'
WHERE question_text = 'How many hurdles are in the 110-meter hurdles race (men)?';

UPDATE questions SET
  question_text = 'Katera disciplina je znana kot "kralja športov"?',
  option_a = 'Maraton',
  option_b = 'Desetboj',
  option_c = '100-metrski šprint',
  option_d = 'Skok v višino'
WHERE question_text = 'Which event is known as the "king of sports"?';

UPDATE questions SET
  question_text = 'Koliko disciplin je v desetboju?',
  option_a = '8',
  option_b = '10',
  option_c = '12',
  option_d = '15'
WHERE question_text = 'How many events are in a decathlon?';

-- Cycling vprašanja
UPDATE questions SET
  question_text = 'Kaj je peloton v kolesarstvu?',
  option_a = 'En kolesar',
  option_b = 'Glavna skupina kolesarjev',
  option_c = 'Kolesarska steza',
  option_d = 'Ciljna črta'
WHERE question_text = 'What is a peloton in cycling?';

UPDATE questions SET
  question_text = 'Koliko koles ima standardno kolo?',
  option_a = '1',
  option_b = '2',
  option_c = '3',
  option_d = '4'
WHERE question_text = 'How many wheels does a standard bicycle have?';

-- Golf vprašanja
UPDATE questions SET
  question_text = 'Koliko lukenj je na standardnem golf igrišču?',
  option_a = '16',
  option_b = '18',
  option_c = '20',
  option_d = '24'
WHERE question_text = 'How many holes are in a standard golf course?';

UPDATE questions SET
  question_text = 'Kaj je par v golfu?',
  option_a = 'Največji rezultat',
  option_b = 'Pričakovani rezultat za luknjo',
  option_c = 'Najmanjši rezultat',
  option_d = 'Zmagalni rezultat'
WHERE question_text = 'What is par in golf?';

UPDATE questions SET
  question_text = 'Kaj je birdie v golfu?',
  option_a = 'Ena pod parom',
  option_b = 'Dve pod parom',
  option_c = 'Ena nad parom',
  option_d = 'Enako kot par'
WHERE question_text = 'What is a birdie in golf?';

UPDATE questions SET
  question_text = 'Kako se imenuje območje, kjer odbijaš žogico?',
  option_a = 'Fairway',
  option_b = 'Green',
  option_c = 'Tee box',
  option_d = 'Rough'
WHERE question_text = 'What do you call the area where you tee off?';

UPDATE questions SET
  question_text = 'Katera golf palica se uporablja na greenu?',
  option_a = 'Driver',
  option_b = 'Iron',
  option_c = 'Putter',
  option_d = 'Wedge'
WHERE question_text = 'What is the golf club used on the green?';