-- Prevod vseh preostalih angleških vprašanj v slovenščino

-- Olympics vprašanja, ki še niso prevedena
UPDATE questions SET 
  question_text = 'Katera medalja se podeli za tretje mesto?',
  option_a = 'Zlata',
  option_b = 'Srebrna',
  option_c = 'Bronasta',
  option_d = 'Bakrna'
WHERE question_text = 'Which medal is awarded for third place?';

UPDATE questions SET
  question_text = 'Kako pogosto potekajo poletne olimpijske igre?',
  option_a = 'Vsaki 2 leti',
  option_b = 'Vsaka 3 leta',
  option_c = 'Vsaka 4 leta',
  option_d = 'Vsaka 5 let'
WHERE question_text = 'How often are the Summer Olympics held?';

UPDATE questions SET
  question_text = 'Katero mesto je gostilo olimpijske igre 2021?',
  option_a = 'Peking',
  option_b = 'Tokio',
  option_c = 'London',
  option_d = 'Rio'
WHERE question_text = 'Which city hosted the 2021 Olympics?';

UPDATE questions SET
  question_text = 'Kaj predstavlja pet olimpijskih obročev?',
  option_a = 'Pet športov',
  option_b = 'Pet kontinentov',
  option_c = 'Pet barv',
  option_d = 'Pet držav'
WHERE question_text = 'What do the five Olympic rings represent?';

UPDATE questions SET
  question_text = 'Kateri je olimpijski moto?',
  option_a = 'Hitreje, višje, močneje',
  option_b = 'Enotnost v raznolikosti',
  option_c = 'Mir skozi šport',
  option_d = 'Poštena igra za vse'
WHERE question_text = 'What is the Olympic motto?';

-- Swimming vprašanja
UPDATE questions SET
  question_text = 'Kateri je najpogostejši plavalni slog?',
  option_a = 'Hrbtno',
  option_b = 'Prosto',
  option_c = 'Prsno',
  option_d = 'Delfin'
WHERE question_text = 'What is the most common swimming stroke?';

UPDATE questions SET
  question_text = 'Koliko metrov je dolg olimpijski bazen?',
  option_a = '25 metrov',
  option_b = '50 metrov',
  option_c = '75 metrov',
  option_d = '100 metrov'
WHERE question_text = 'How long is an Olympic swimming pool?';

UPDATE questions SET
  question_text = 'Kateri plavalec je osvojil največ olimpijskih zlatih medalj?',
  option_a = 'Mark Spitz',
  option_b = 'Michael Phelps',
  option_c = 'Ian Thorpe',
  option_d = 'Adam Peaty'
WHERE question_text = 'Which swimmer has won the most Olympic gold medals?';

UPDATE questions SET
  question_text = 'Kaj je plavalna proga?',
  option_a = 'Del bazena za enega plavalca',
  option_b = 'Vrsta plavalnega sloga',
  option_c = 'Plavalno tekmovanje',
  option_d = 'Plavalna oprema'
WHERE question_text = 'What is a swimming lane?';

UPDATE questions SET
  question_text = 'Kaj pomeni prosto v plavanju?',
  option_a = 'Dovoljen je vsak slog',
  option_b = 'Samo hrbtno',
  option_c = 'Brez časomera',
  option_d = 'Kratka razdalja'
WHERE question_text = 'What does freestyle mean in swimming?';

-- Athletics vprašanja
UPDATE questions SET
  question_text = 'Kakšna je standardna razdalja maratona?',
  option_a = '40,2 km',
  option_b = '42,195 km',
  option_c = '45 km',
  option_d = '50 km'
WHERE question_text = 'What is the standard distance of a marathon?';

UPDATE questions SET
  question_text = 'Koliko ovir je v teku na 110 m z ovirami?',
  option_a = '8',
  option_b = '10',
  option_c = '12',
  option_d = '15'
WHERE question_text = 'How many hurdles are in a 110m hurdles race?';

UPDATE questions SET
  question_text = 'Kakšen je svetovni rekord v teku na 100 m (moški)?',
  option_a = '9,58 sekunde',
  option_b = '9,72 sekunde',
  option_c = '9,84 sekunde',
  option_d = '9,95 sekunde'
WHERE question_text = 'What is the world record for 100m sprint (men)?';

UPDATE questions SET
  question_text = 'Kaj je kopje?',
  option_a = 'Tekaška čevlj',
  option_b = 'Atletsko orodje za met',
  option_c = 'Vrsta teka',
  option_d = 'Skakalnica'
WHERE question_text = 'What is a javelin?';

UPDATE questions SET
  question_text = 'Koliko poskusov imajo atleti pri metu krogle?',
  option_a = '2',
  option_b = '3',
  option_c = '4',
  option_d = '6'
WHERE question_text = 'How many attempts do athletes get in shot put?';

-- Football vprašanja
UPDATE questions SET
  question_text = 'Kateri klub je osvojil največ naslovov UEFA lige prvakov?',
  option_a = 'Barcelona',
  option_b = 'Real Madrid',
  option_c = 'Bayern München',
  option_d = 'AC Milan'
WHERE question_text = 'Which club has won the most UEFA Champions League titles?';

UPDATE questions SET
  question_text = 'Kaj je pravilo prepovedanega položaja v nogometu?',
  option_a = 'Igralec ne sme biti za zadnjim branilcem',
  option_b = 'Igralec ne sme uporabiti rok',
  option_c = 'Igralec ne sme zapustiti igrišča',
  option_d = 'Igralec ne sme teči'
WHERE question_text = 'What is the offside rule in football?';

UPDATE questions SET
  question_text = 'Kaj za FIFA pomeni?',
  option_a = 'Mednarodna nogometna federacija',
  option_b = 'Evropska nogometna zveza',
  option_c = 'Svetovna nogometna organizacija',
  option_d = 'Profesionalna nogometna liga'
WHERE question_text = 'What does FIFA stand for?';

UPDATE questions SET
  question_text = 'Katera država je osvojila največ svetovnih prvenstev?',
  option_a = 'Nemčija',
  option_b = 'Brazilija',
  option_c = 'Argentina',
  option_d = 'Italija'
WHERE question_text = 'Which country has won the most World Cups?';

UPDATE questions SET
  question_text = 'Kaj je hat-trick v nogometu?',
  option_a = 'Trije goli enega igralca',
  option_b = 'Tri kartone',
  option_c = 'Tri prepovedana položaja',
  option_d = 'Tri zamenjave'
WHERE question_text = 'What is a hat-trick in football?';

UPDATE questions SET
  question_text = 'Koliko je dolgo streljanje enajstmetrovk?',
  option_a = '5 strelov vsaki',
  option_b = '3 streli vsaki',
  option_c = '10 strelov skupaj',
  option_d = 'Do prvega zgrešenega'
WHERE question_text = 'How long is a football penalty shootout?';

UPDATE questions SET
  question_text = 'Kako se imenuje kazensko območje?',
  option_a = 'Gol box',
  option_b = 'Kazenski prostor',
  option_c = 'Območje za enajstmetrovko',
  option_d = 'Varno območje'
WHERE question_text = 'What is the penalty area also called?';

UPDATE questions SET
  question_text = 'Katera pozicija ne sme uporabljati rok v nogometu?',
  option_a = 'Vratarju',
  option_b = 'Vsi igralci razen vratarja',
  option_c = 'Branilec',
  option_d = 'Napadalec'
WHERE question_text = 'Which position cannot use hands in football?';

-- Basketball vprašanja
UPDATE questions SET
  question_text = 'Koliko igralcev ima košarkarska ekipa na igrišču?',
  option_a = '4',
  option_b = '5',
  option_c = '6',
  option_d = '7'
WHERE question_text = 'How many players are on a basketball team on the court?';

UPDATE questions SET
  question_text = 'Kakšna je višina košarkarskega koša?',
  option_a = '3 metre',
  option_b = '3,05 metrov',
  option_c = '3,5 metrov',
  option_d = '4 metre'
WHERE question_text = 'What is the height of a basketball hoop?';

UPDATE questions SET
  question_text = 'Katera NBA ekipa je osvojila največ naslovov prvaka?',
  option_a = 'Los Angeles Lakers',
  option_b = 'Boston Celtics',
  option_c = 'Chicago Bulls',
  option_d = 'Golden State Warriors'
WHERE question_text = 'Which NBA team has won the most championships?';

UPDATE questions SET
  question_text = 'Koliko traja NBA tekma?',
  option_a = '40 minut',
  option_b = '48 minut',
  option_c = '60 minut',
  option_d = '80 minut'
WHERE question_text = 'How long is an NBA game?';

UPDATE questions SET
  question_text = 'Kaj je slam dunk?',
  option_a = 'Met z razdalje 3 točk',
  option_b = 'Zabijanje žoge v koš',
  option_c = 'Obrambni potez',
  option_d = 'Vrsta prekrška'
WHERE question_text = 'What is a slam dunk?';

-- Tennis vprašanja
UPDATE questions SET
  question_text = 'Koliko setov morate zmagati za zmago v tenisu?',
  option_a = '2 od 3',
  option_b = '3 od 5',
  option_c = '1 od 2',
  option_d = 'Odvisno od turnirja'
WHERE question_text = 'How many sets do you need to win a tennis match?';

UPDATE questions SET
  question_text = 'Kakšen je sistem točkovanja v tenisu?',
  option_a = '1, 2, 3, 4',
  option_b = '0, 15, 30, 40',
  option_c = '5, 10, 15, 20',
  option_d = '0, 1, 2, 3'
WHERE question_text = 'What is the scoring system in tennis?';

UPDATE questions SET
  question_text = 'Kateri turnir NI Grand Slam?',
  option_a = 'Wimbledon',
  option_b = 'Masters 1000',
  option_c = 'US Open',
  option_d = 'Roland Garros'
WHERE question_text = 'Which tournament is NOT a Grand Slam?';

UPDATE questions SET
  question_text = 'Kaj je as v tenisu?',
  option_a = 'Popoln servis',
  option_b = 'Zmagani set',
  option_c = 'Napaka nasprotnika',
  option_d = 'Močan udarec'
WHERE question_text = 'What is an ace in tennis?';

UPDATE questions SET
  question_text = 'Koliko iger je v teniškem setu?',
  option_a = '6 iger minimum',
  option_b = '8 iger minimum',
  option_c = '10 iger minimum',
  option_d = '12 iger minimum'
WHERE question_text = 'How many games are in a tennis set?';

-- Cycling vprašanja
UPDATE questions SET
  question_text = 'Katera je najbolj znana kolesarska dirka?',
  option_a = 'Giro d\'Italia',
  option_b = 'Tour de France',
  option_c = 'Vuelta a España',
  option_d = 'Svetovno prvenstvo'
WHERE question_text = 'What is the most famous cycling race?';

UPDATE questions SET
  question_text = 'Koliko etap je običajno na Tour de France?',
  option_a = '18',
  option_b = '21',
  option_c = '24',
  option_d = '30'
WHERE question_text = 'How many stages are typically in Tour de France?';

UPDATE questions SET
  question_text = 'Katero majico nosi vodilni na Tour de France?',
  option_a = 'Zeleno',
  option_b = 'Rumeno',
  option_c = 'Rdeče',
  option_d = 'Modro'
WHERE question_text = 'What jersey does the Tour de France leader wear?';

-- Ostala športna vprašanja
UPDATE questions SET
  question_text = 'Kateri šport se igra na Wimbledonu?',
  option_a = 'Golf',
  option_b = 'Tenis',
  option_c = 'Kriket',
  option_d = 'Squash'
WHERE question_text = 'What sport is played at Wimbledon?';

UPDATE questions SET
  question_text = 'Koliko igralcev je v odbojkarski ekipi na igrišču?',
  option_a = '5',
  option_b = '6',
  option_c = '7',
  option_d = '8'
WHERE question_text = 'How many players are in a volleyball team on court?';

UPDATE questions SET
  question_text = 'Kakšen je najvišji možni rezultat v kegljanju?',
  option_a = '200',
  option_b = '250',
  option_c = '300',
  option_d = '350'
WHERE question_text = 'What is the highest score possible in ten-pin bowling?';

UPDATE questions SET
  question_text = 'Kateri šport uporablja pernat žogico?',
  option_a = 'Tenis',
  option_b = 'Badminton',
  option_c = 'Squash',
  option_d = 'Namizni tenis'
WHERE question_text = 'Which sport uses a shuttlecock?';