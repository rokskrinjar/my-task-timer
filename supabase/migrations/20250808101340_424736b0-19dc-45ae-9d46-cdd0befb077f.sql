-- Add category field to questions table
ALTER TABLE public.questions ADD COLUMN category TEXT NOT NULL DEFAULT 'Osnovna šola';

-- Update existing questions with appropriate categories
UPDATE public.questions SET category = 'Osnovna šola' WHERE subject IN ('Matematika', 'Slovenščina', 'Naravoslovje');
UPDATE public.questions SET category = 'Geografija' WHERE subject = 'Geografija';

-- Add category field to games table to store selected category
ALTER TABLE public.games ADD COLUMN category TEXT DEFAULT 'Osnovna šola';

-- Insert many more questions for each category

-- Osnovna šola questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Koliko je 5 + 7?', 'Matematika', '11', '12', '13', '14', 'B', 1, 6, 'Osnovna šola'),
('Katera barva nastane iz mešanja rdeče in rumene?', 'Likovna', 'Zelena', 'Oranžna', 'Vijolična', 'Modra', 'B', 1, 7, 'Osnovna šola'),
('Koliko je 9 × 6?', 'Matematika', '52', '54', '56', '58', 'B', 2, 8, 'Osnovna šola'),
('Kaj je največ planeta v našem osončju?', 'Naravoslovje', 'Jupiter', 'Saturn', 'Sonce', 'Zemlja', 'A', 3, 9, 'Osnovna šola'),
('Koliko je 144 ÷ 12?', 'Matematika', '11', '12', '13', '14', 'B', 4, 10, 'Osnovna šola'),
('Kdo je napisal Martina Krpana?', 'Slovenščina', 'Ivan Cankar', 'Fran Levstik', 'Josip Jurčič', 'Anton Aškerc', 'B', 4, 11, 'Osnovna šola'),
('Kateri organ v telesu črpa kri?', 'Naravoslovje', 'Jetra', 'Srce', 'Pljuča', 'Želodec', 'B', 3, 12, 'Osnovna šola'),
('Koliko je 25% od 80?', 'Matematika', '15', '20', '25', '30', 'B', 5, 13, 'Osnovna šola'),
('V katerem letu je bila razglašena samostojnost Slovenije?', 'Zgodovina', '1990', '1991', '1992', '1993', 'B', 5, 14, 'Osnovna šola'),
('Katera je najmanjša enota življenja?', 'Naravoslovje', 'Atom', 'Celica', 'Molekula', 'Organ', 'B', 4, 15, 'Osnovna šola');

-- Geografija questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Katera je najdaljša reka na svetu?', 'Geografija', 'Nil', 'Amazonka', 'Jangce', 'Mississippi', 'A', 3, 16, 'Geografija'),
('V kateri državi je Machu Picchu?', 'Geografija', 'Čile', 'Bolivija', 'Peru', 'Ekvador', 'C', 4, 17, 'Geografija'),
('Katera je največja celina?', 'Geografija', 'Afrika', 'Azija', 'Severna Amerika', 'Južna Amerika', 'B', 2, 18, 'Geografija'),
('Katera je najvišja gora na svetu?', 'Geografija', 'K2', 'Everest', 'Kančendžunga', 'Lhotse', 'B', 3, 19, 'Geografija'),
('Katera je glavno mesto Avstrije?', 'Geografija', 'Salzburg', 'Innsbruck', 'Gradec', 'Dunaj', 'D', 2, 20, 'Geografija'),
('Kateri ocean je največji?', 'Geografija', 'Atlantski', 'Indijski', 'Tihi', 'Arktični', 'C', 2, 21, 'Geografija'),
('V kateri državi je Sahara?', 'Geografija', 'Egipt', 'Libija', 'Alžirija', 'Vse naštete', 'D', 4, 22, 'Geografija'),
('Katera je glavni mesto Francije?', 'Geografija', 'Lyon', 'Marseille', 'Pariz', 'Nice', 'C', 1, 23, 'Geografija'),
('Katero jezero je najgloblje na svetu?', 'Geografija', 'Kaspijsko', 'Bajkalsko', 'Viktorijino', 'Huron', 'B', 4, 24, 'Geografija'),
('Katera država ima največ časovnih pasov?', 'Geografija', 'Rusija', 'ZDA', 'Kitajska', 'Kanada', 'A', 5, 25, 'Geografija');

-- Živali questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Katera žival je najhitrejša na kopnem?', 'Naravoslovje', 'Lev', 'Gepard', 'Antilopa', 'Konj', 'B', 3, 26, 'Živali'),
('Koliko src ima hobotnica?', 'Naravoslovje', '1', '2', '3', '8', 'C', 4, 27, 'Živali'),
('Katera žival je največja na svetu?', 'Naravoslovje', 'Slon', 'Modri kit', 'Žirafa', 'Nosorog', 'B', 2, 28, 'Živali'),
('Katera ptica ne more leteti?', 'Naravoslovje', 'Noj', 'Pingvin', 'Kivi', 'Vse naštete', 'D', 3, 29, 'Živali'),
('Koliko nog ima muha?', 'Naravoslovje', '4', '6', '8', '10', 'B', 2, 30, 'Živali'),
('Katera žival spada med sesalce?', 'Naravoslovje', 'Kača', 'Pes', 'Rib', 'Žaba', 'B', 1, 31, 'Živali'),
('Katera žival lahko spi več kot 20 ur na dan?', 'Naravoslovje', 'Koala', 'Lenivec', 'Medved', 'Mačka', 'A', 4, 32, 'Živali'),
('Katera žival je znana po svojem smehom?', 'Naravoslovje', 'Hiena', 'Opica', 'Delfin', 'Papagaj', 'A', 3, 33, 'Živali'),
('Koliko zob ima odrasel človek?', 'Naravoslovje', '28', '30', '32', '34', 'C', 4, 34, 'Živali'),
('Katera žival lahko živi več kot 100 let?', 'Naravoslovje', 'Slon', 'Želva', 'Velikan', 'Kit', 'B', 4, 35, 'Živali');

-- Friends Trivia questions  
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Kako se imenuje kavarna, kjer prijatelji preživljajo čas?', 'Zabava', 'Central Perk', 'Coffee Bean', 'Starbucks', 'Cafe Monica', 'A', 3, 36, 'Friends Trivia'),
('Kakšen poklic ima Ross?', 'Zabava', 'Zdravnik', 'Paleontolog', 'Učitelj', 'Znanstvenik', 'B', 3, 37, 'Friends Trivia'),
('Kako se imenuje Rachelina hči?', 'Zabava', 'Emily', 'Emma', 'Erica', 'Elena', 'B', 3, 38, 'Friends Trivia'),
('Kakšen poklic ima Monica?', 'Zabava', 'Kuharica', 'Natakarica', 'Učiteljica', 'Zdravnica', 'A', 2, 39, 'Friends Trivia'),
('S kom se Ross poroči najprej?', 'Zabava', 'Rachel', 'Emily', 'Carol', 'Susan', 'C', 4, 40, 'Friends Trivia'),
('Katera pesem poje Phoebe v kavarni?', 'Zabava', 'Smelly Cat', 'Happy Cat', 'Funny Cat', 'Crazy Cat', 'A', 2, 41, 'Friends Trivia'),
('Kje dela Rachel na začetku serije?', 'Zabava', 'Bloomingdales', 'Central Perk', 'Ralph Lauren', 'Louis Vuitton', 'B', 3, 42, 'Friends Trivia'),
('Kako se imenuje Joeyjev najljubši sendvič?', 'Zabava', 'Meatball sub', 'Italian', 'Pastrami', 'Turkey', 'A', 4, 43, 'Friends Trivia'),
('V kateri sezoni se Ross in Rachel prvič poljubita?', 'Zabava', '1', '2', '3', '4', 'A', 4, 44, 'Friends Trivia'),
('Kako se imenuje Chandlerjev srednji name?', 'Zabava', 'Matthew', 'Muriel', 'Michael', 'Martin', 'B', 5, 45, 'Friends Trivia');

-- Music questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Kdo je napisal "Für Elise"?', 'Glasba', 'Mozart', 'Beethoven', 'Bach', 'Chopin', 'B', 4, 46, 'Music'),
('Kateri instrument ima 88 tipk?', 'Glasba', 'Orgle', 'Harmonika', 'Klavir', 'Harfa', 'C', 2, 47, 'Music'),
('Katera skupina je posnela "Bohemian Rhapsody"?', 'Glasba', 'Led Zeppelin', 'Queen', 'The Beatles', 'Pink Floyd', 'B', 4, 48, 'Music'),
('Koliko strun ima standardna kitara?', 'Glasba', '4', '5', '6', '7', 'C', 2, 49, 'Music'),
('Kdo je "King of Pop"?', 'Glasba', 'Elvis Presley', 'Prince', 'Michael Jackson', 'Frank Sinatra', 'C', 3, 50, 'Music'),
('V katerem letu so se razšli The Beatles?', 'Glasba', '1969', '1970', '1971', '1972', 'B', 4, 51, 'Music'),
('Kateri glasbeni ključ se uporablja za visoke tone?', 'Glasba', 'Basovski', 'Violinski', 'Altovski', 'Tenorski', 'B', 3, 52, 'Music'),
('Kdo je napisal "The Four Seasons"?', 'Glasba', 'Bach', 'Vivaldi', 'Handel', 'Telemann', 'B', 4, 53, 'Music'),
('Kateri žanr glasbe izhaja iz New Orleansa?', 'Glasba', 'Blues', 'Jazz', 'Rock', 'Country', 'B', 4, 54, 'Music'),
('Kako se imenuje najvisji moški glas?', 'Glasba', 'Tenor', 'Bariton', 'Bas', 'Sopran', 'A', 3, 55, 'Music');

-- Movies questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Kdo je režiral film "Titanic"?', 'Film', 'Steven Spielberg', 'James Cameron', 'Martin Scorsese', 'Christopher Nolan', 'B', 4, 56, 'Movies'),
('V katerem letu je izšel prvi film "Star Wars"?', 'Film', '1975', '1976', '1977', '1978', 'C', 4, 57, 'Movies'),
('Kateri film je osvojil največ Oskarjev?', 'Film', 'Titanic', 'Ben-Hur', 'Lord of the Rings', 'Vse enako (11)', 'D', 5, 58, 'Movies'),
('Kdo je odigral Harryja Potterja?', 'Film', 'Rupert Grint', 'Daniel Radcliffe', 'Tom Felton', 'Matthew Lewis', 'B', 2, 59, 'Movies'),
('V katerem filmu je slavna replika "May the Force be with you"?', 'Film', 'Star Trek', 'Star Wars', 'Guardians of Galaxy', 'Interstellar', 'B', 3, 60, 'Movies'),
('Kdo je režiral trilogijo "Lord of the Rings"?', 'Film', 'Peter Jackson', 'Ridley Scott', 'George Lucas', 'Tim Burton', 'A', 4, 61, 'Movies'),
('Kateri film je prva animacija Disneyja?', 'Film', 'Bambi', 'Sneguljčica', 'Pinokkio', 'Dumbo', 'B', 3, 62, 'Movies'),
('V katerem filmu nastopa Jack Sparrow?', 'Film', 'Pirates of Caribbean', 'Treasure Island', 'Peter Pan', 'Hook', 'A', 2, 63, 'Movies'),
('Kdo je odigral Forresta Gumpa?', 'Film', 'Tom Cruise', 'Tom Hanks', 'Brad Pitt', 'Will Smith', 'B', 4, 64, 'Movies'),
('Kateri žanr je film "The Shining"?', 'Film', 'Komedija', 'Drama', 'Grozljivka', 'Akcija', 'C', 4, 65, 'Movies');

-- High School questions
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Katera je kemijska oznaka za zlato?', 'Kemija', 'Go', 'Au', 'Ag', 'Al', 'B', 7, 66, 'High School'),
('Kdo je napisal "Romeo in Julija"?', 'Literatura', 'Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Oscar Wilde', 'B', 6, 67, 'High School'),
('Koliko je sin(90°)?', 'Matematika', '0', '1', '-1', '1/2', 'B', 8, 68, 'High School'),
('V katerem letu je bila francoska revolucija?', 'Zgodovina', '1789', '1799', '1804', '1815', 'A', 7, 69, 'High School'),
('Katera je enota za električni tok?', 'Fizika', 'Volt', 'Watt', 'Amper', 'Ohm', 'C', 8, 70, 'High School'),
('Kdo je razvil teorijo relativnosti?', 'Fizika', 'Newton', 'Einstein', 'Galilei', 'Tesla', 'B', 7, 71, 'High School'),
('Katera organela je "elektrarna" celice?', 'Biologija', 'Jedro', 'Ribosom', 'Mitohondrij', 'Lizozom', 'C', 7, 72, 'High School'),
('Koliko je kvadratni koren iz 144?', 'Matematika', '11', '12', '13', '14', 'B', 6, 73, 'High School'),
('Katera je periodična oznaka za kisik?', 'Kemija', 'O', 'K', 'C', 'Ca', 'A', 6, 74, 'High School'),
('Kdo je napisal "1984"?', 'Literatura', 'Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells', 'B', 8, 75, 'High School');