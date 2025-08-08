-- Add many more questions for "Osnovna šola" category with varying difficulty levels

-- Grade 1 questions (Easy difficulty, difficulty_order 1-20)
INSERT INTO public.questions (question_text, subject, option_a, option_b, option_c, option_d, correct_answer, grade_level, difficulty_order, category) VALUES
('Koliko je 2 + 3?', 'Matematika', '4', '5', '6', '7', 'B', 1, 1, 'Osnovna šola'),
('Katera barva nastane, če zmešamo rdečo in rumeno?', 'Likovna umetnost', 'Zelena', 'Oranžna', 'Vijolična', 'Modra', 'B', 1, 2, 'Osnovna šola'),
('Koliko kril ima ptica?', 'Naravoslovje', '1', '2', '3', '4', 'B', 1, 3, 'Osnovna šola'),
('Katera črka pride za A?', 'Slovenščina', 'B', 'C', 'D', 'E', 'A', 1, 4, 'Osnovna šola'),
('Koliko je 5 - 2?', 'Matematika', '2', '3', '4', '5', 'B', 1, 5, 'Osnovna šola'),
('Katero letni čas sledi pomladi?', 'Naravoslovje', 'Zima', 'Jesen', 'Poletje', 'Zima', 'C', 1, 6, 'Osnovna šola'),
('Koliko nog ima pes?', 'Naravoslovje', '2', '3', '4', '5', 'C', 1, 7, 'Osnovna šola'),
('Kaj je 10 - 5?', 'Matematika', '4', '5', '6', '7', 'B', 1, 8, 'Osnovna šola'),
('Katera oblika ima krog?', 'Matematika', 'Trikotna', 'Kvadratna', 'Okrogla', 'Pravokotna', 'C', 1, 9, 'Osnovna šola'),
('Koliko prstov ima na eni roki?', 'Splošno', '3', '4', '5', '6', 'C', 1, 10, 'Osnovna šola'),

-- Grade 2 questions (Medium difficulty, difficulty_order 21-40)
('Koliko je 8 + 7?', 'Matematika', '14', '15', '16', '17', 'B', 2, 21, 'Osnovna šola'),
('Katero je največje mesto v Sloveniji?', 'Geografija', 'Maribor', 'Celje', 'Ljubljana', 'Kranj', 'C', 2, 22, 'Osnovna šola'),
('Koliko mesecev ima leto?', 'Naravoslovje', '10', '11', '12', '13', 'C', 2, 23, 'Osnovna šola'),
('Kaj pomeni beseda "velika"?', 'Slovenščina', 'Majhna', 'Visoka', 'Široka', 'Obsežna', 'D', 2, 24, 'Osnovna šola'),
('Koliko je 6 × 3?', 'Matematika', '15', '16', '17', '18', 'D', 2, 25, 'Osnovna šola'),
('Katera reka teče skozi Ljubljano?', 'Geografija', 'Sava', 'Drava', 'Ljubljanica', 'Mura', 'C', 2, 26, 'Osnovna šola'),
('Koliko je 20 ÷ 4?', 'Matematika', '4', '5', '6', '7', 'B', 2, 27, 'Osnovna šola'),
('Katero žival poznamo kot kralja živali?', 'Naravoslovje', 'Tiger', 'Lev', 'Slon', 'Medved', 'B', 2, 28, 'Osnovna šola'),
('Koliko strani ima kvadrat?', 'Matematika', '3', '4', '5', '6', 'B', 2, 29, 'Osnovna šola'),
('V katerem letnem času so listi rumeni?', 'Naravoslovje', 'Pomlad', 'Poletje', 'Jesen', 'Zima', 'C', 2, 30, 'Osnovna šola'),

-- Grade 3 questions (Medium-Hard difficulty, difficulty_order 41-60)
('Koliko je 15 × 8?', 'Matematika', '110', '115', '120', '125', 'C', 3, 41, 'Osnovna šola'),
('Kdo je napisal Prešernove pesmi?', 'Slovenščina', 'Ivan Cankar', 'Janez Vajkard Valvasor', 'France Prešeren', 'Anton Aškerc', 'C', 3, 42, 'Osnovna šola'),
('Katera planeta je najbližja Soncu?', 'Naravoslovje', 'Venera', 'Merkur', 'Zemlja', 'Mars', 'B', 3, 43, 'Osnovna šola'),
('Koliko je 144 ÷ 12?', 'Matematika', '11', '12', '13', '14', 'B', 3, 44, 'Osnovna šola'),
('Katero jezero je največje v Sloveniji?', 'Geografija', 'Bohinjsko jezero', 'Blejsko jezero', 'Cerkniško jezero', 'Ptujsko jezero', 'A', 3, 45, 'Osnovna šola'),
('Kaj je glavno mesto Italije?', 'Geografija', 'Milano', 'Napoli', 'Rim', 'Benetke', 'C', 3, 46, 'Osnovna šola'),
('Koliko je 25²?', 'Matematika', '525', '575', '625', '675', 'C', 3, 47, 'Osnovna šola'),
('Katera snov se pri 0°C spremeni v led?', 'Naravoslovje', 'Olje', 'Voda', 'Mleko', 'Sok', 'B', 3, 48, 'Osnovna šola'),
('Katero leto je bila razglašena slovenska osamosvojitev?', 'Zgodovina', '1989', '1990', '1991', '1992', 'C', 3, 49, 'Osnovna šola'),
('Koliko je √81?', 'Matematika', '8', '9', '10', '11', 'B', 3, 50, 'Osnovna šola'),

-- Grade 4-5 questions (Hard difficulty, difficulty_order 61-80)
('Kdo je avtor romana "Deseti brat"?', 'Slovenščina', 'Ivan Cankar', 'Josip Jurčič', 'Anton Aškerc', 'Janez Jalen', 'B', 4, 61, 'Osnovna šola'),
('Koliko je 17 × 23?', 'Matematika', '371', '381', '391', '401', 'C', 4, 62, 'Osnovna šola'),
('Katera gorska veriga ločuje Evropo od Azije?', 'Geografija', 'Alpe', 'Pireneji', 'Ural', 'Karpatni', 'C', 4, 63, 'Osnovna šola'),
('V katerem letu se je končala prva svetovna vojna?', 'Zgodovina', '1917', '1918', '1919', '1920', 'B', 4, 64, 'Osnovna šola'),
('Koliko je 7/8 od 64?', 'Matematika', '52', '54', '56', '58', 'C', 4, 65, 'Osnovna šola'),
('Katera je kemijska formula za vodo?', 'Naravoslovje', 'H2O', 'CO2', 'NaCl', 'O2', 'A', 4, 66, 'Osnovna šola'),
('Kdo je bil prvi slovenski predsednik?', 'Zgodovina', 'Janez Drnovšek', 'Milan Kučan', 'Danilo Türk', 'Borut Pahor', 'B', 4, 67, 'Osnovna šola'),
('Koliko je sin(90°)?', 'Matematika', '0', '0.5', '1', '√2/2', 'C', 5, 68, 'Osnovna šola'),
('Katero is večjih jezer v Sloveniji?', 'Geografija', 'Bohinjsko', 'Blejsko', 'Cerkniško', 'Velenjsko', 'A', 5, 69, 'Osnovna šola'),
('Kaj pomeni kratica EU?', 'Družba', 'Evropska ustava', 'Evropska unija', 'Evropska univerza', 'Evropska ustanova', 'B', 5, 70, 'Osnovna šola'),

-- Add more variety with additional questions across all difficulty levels
('Koliko je 9 + 6?', 'Matematika', '14', '15', '16', '17', 'B', 1, 11, 'Osnovna šola'),
('Katero žival poznamo kot najhitrejšo na kopnem?', 'Naravoslovje', 'Gepard', 'Lev', 'Antilopa', 'Konj', 'A', 1, 12, 'Osnovna šola'),
('Koliko je 4 × 2?', 'Matematika', '6', '7', '8', '9', 'C', 1, 13, 'Osnovna šola'),
('Katera barva nastane če zmešamo modro in rumeno?', 'Likovna umetnost', 'Oranžna', 'Zelena', 'Vijolična', 'Roza', 'B', 1, 14, 'Osnovna šola'),
('Koliko je 15 - 8?', 'Matematika', '6', '7', '8', '9', 'B', 1, 15, 'Osnovna šola'),

('Koliko je 13 + 9?', 'Matematika', '21', '22', '23', '24', 'B', 2, 31, 'Osnovna šola'),
('Katera je prestolnica Francije?', 'Geografija', 'London', 'Berlin', 'Pariz', 'Madrid', 'C', 2, 32, 'Osnovna šola'),
('Koliko strani ima trikotnik?', 'Matematika', '2', '3', '4', '5', 'B', 2, 33, 'Osnovna šola'),
('Katero je najlažji kamen?', 'Naravoslovje', 'Granit', 'Marmor', 'Apnenec', 'Vulkanski kamen', 'D', 2, 34, 'Osnovna šola'),
('Koliko je 7 × 9?', 'Matematika', '61', '62', '63', '64', 'C', 2, 35, 'Osnovna šola'),

('Koliko je 18 × 15?', 'Matematika', '260', '270', '280', '290', 'B', 3, 51, 'Osnovna šola'),
('Kdo je napisal Krst pri Savici?', 'Slovenščina', 'France Prešeren', 'Ivan Cankar', 'Anton Aškerc', 'Josip Jurčič', 'A', 3, 52, 'Osnovna šola'),
('Koliko kontinentov je na Zemlji?', 'Geografija', '5', '6', '7', '8', 'C', 3, 53, 'Osnovna šola'),
('Katero je glavno mesto Avstrije?', 'Geografija', 'Salzburg', 'Innsbruck', 'Gradec', 'Dunaj', 'D', 3, 54, 'Osnovna šola'),
('Koliko je 196 ÷ 14?', 'Matematika', '13', '14', '15', '16', 'B', 3, 55, 'Osnovna šola'),

('Koliko je 23 × 19?', 'Matematika', '427', '437', '447', '457', 'B', 4, 71, 'Osnovna šola'),
('V katerem letu je bil sprejet ustava Republike Slovenije?', 'Zgodovina', '1990', '1991', '1992', '1993', 'B', 4, 72, 'Osnovna šola'),
('Katera je najvišja gora v Sloveniji?', 'Geografija', 'Škrlatica', 'Mangart', 'Triglav', 'Razor', 'C', 4, 73, 'Osnovna šola'),
('Koliko je 3/5 od 75?', 'Matematika', '43', '45', '47', '49', 'B', 4, 74, 'Osnovna šola'),
('Kdo je prvi človek na Luni?', 'Zgodovina', 'Neil Armstrong', 'Buzz Aldrin', 'John Glenn', 'Alan Shepard', 'A', 5, 75, 'Osnovna šola');