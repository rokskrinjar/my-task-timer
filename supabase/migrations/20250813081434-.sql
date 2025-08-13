-- Add Sports questions to the database
INSERT INTO public.questions (question_text, option_a, option_b, option_c, option_d, correct_answer, subject, grade_level, difficulty_order, category) VALUES
-- Football questions
('Which country won the FIFA World Cup in 2018?', 'Brazil', 'Germany', 'France', 'Argentina', 'C', 'Football', 8, 1, 'Sports'),
('How many players are on a football team on the field at one time?', '10', '11', '12', '9', 'B', 'Football', 6, 2, 'Sports'),
('What is the maximum duration of a football match?', '80 minutes', '90 minutes', '100 minutes', '120 minutes', 'B', 'Football', 7, 3, 'Sports'),
('Which club has won the most UEFA Champions League titles?', 'Barcelona', 'AC Milan', 'Real Madrid', 'Bayern Munich', 'C', 'Football', 9, 4, 'Sports'),
('What is the offside rule in football?', 'Player cannot be behind the last defender', 'Player cannot touch the ball with hands', 'Player cannot leave the field', 'Player cannot argue with referee', 'A', 'Football', 8, 5, 'Sports'),

-- Basketball questions
('How many players are on a basketball team on the court?', '4', '5', '6', '7', 'B', 'Basketball', 6, 6, 'Sports'),
('What is the height of a basketball hoop?', '3 meters', '3.05 meters', '3.5 meters', '2.8 meters', 'B', 'Basketball', 7, 7, 'Sports'),
('Which NBA team has won the most championships?', 'Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors', 'B', 'Basketball', 8, 8, 'Sports'),
('How long is an NBA game?', '40 minutes', '48 minutes', '50 minutes', '60 minutes', 'B', 'Basketball', 7, 9, 'Sports'),
('What is a slam dunk?', 'Shooting from 3-point line', 'Forcefully putting ball through hoop', 'Stealing the ball', 'Blocking a shot', 'B', 'Basketball', 6, 10, 'Sports'),

-- Tennis questions
('How many sets do you need to win a tennis match?', '2 out of 3', '3 out of 5', 'Depends on tournament', '1 set only', 'C', 'Tennis', 8, 11, 'Sports'),
('What is the scoring system in tennis?', '1, 2, 3, 4', '15, 30, 40, game', '10, 20, 30, 40', '5, 10, 15, 20', 'B', 'Tennis', 7, 12, 'Sports'),
('Which tournament is NOT a Grand Slam?', 'Wimbledon', 'US Open', 'ATP Finals', 'French Open', 'C', 'Tennis', 9, 13, 'Sports'),
('What is an ace in tennis?', 'Perfect shot', 'Serve that opponent cannot return', 'Winning the set', 'Double fault', 'B', 'Tennis', 7, 14, 'Sports'),
('How many games are in a tennis set?', '6 games minimum', '8 games always', '10 games always', '5 games minimum', 'A', 'Tennis', 8, 15, 'Sports'),

-- Olympics questions
('How often are the Summer Olympics held?', 'Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years', 'C', 'Olympics', 6, 16, 'Sports'),
('Which city hosted the 2021 Olympics?', 'Beijing', 'Tokyo', 'Paris', 'Los Angeles', 'B', 'Olympics', 7, 17, 'Sports'),
('What do the five Olympic rings represent?', 'Five sports', 'Five continents', 'Five countries', 'Five colors', 'B', 'Olympics', 8, 18, 'Sports'),
('Which medal is awarded for third place?', 'Gold', 'Silver', 'Bronze', 'Copper', 'C', 'Olympics', 6, 19, 'Sports'),
('What is the Olympic motto?', 'Faster, Higher, Stronger', 'Unity, Peace, Sport', 'Excellence, Friendship, Respect', 'Champions, Glory, Victory', 'A', 'Olympics', 8, 20, 'Sports'),

-- Swimming questions
('What is the most common swimming stroke?', 'Backstroke', 'Butterfly', 'Freestyle', 'Breaststroke', 'C', 'Swimming', 7, 21, 'Sports'),
('How long is an Olympic swimming pool?', '25 meters', '50 meters', '75 meters', '100 meters', 'B', 'Swimming', 8, 22, 'Sports'),
('Which swimmer has won the most Olympic gold medals?', 'Mark Spitz', 'Michael Phelps', 'Ian Thorpe', 'Adam Peaty', 'B', 'Swimming', 9, 23, 'Sports'),
('What is a swimming lane?', 'Pool section for one swimmer', 'Type of stroke', 'Swimming equipment', 'Pool depth', 'A', 'Swimming', 6, 24, 'Sports'),
('What does freestyle mean in swimming?', 'Any stroke allowed', 'Front crawl only', 'Backstroke only', 'No rules', 'A', 'Swimming', 7, 25, 'Sports'),

-- Athletics questions
('What is the standard distance of a marathon?', '40.2 km', '42.195 km', '45 km', '50 km', 'B', 'Athletics', 8, 26, 'Sports'),
('How many hurdles are in a 110m hurdles race?', '8', '10', '12', '15', 'B', 'Athletics', 7, 27, 'Sports'),
('What is the world record for 100m sprint (men)?', '9.58 seconds', '9.63 seconds', '9.69 seconds', '9.72 seconds', 'A', 'Athletics', 9, 28, 'Sports'),
('What is a javelin?', 'Running shoe', 'Spear-like object', 'Type of track', 'Jumping technique', 'B', 'Athletics', 6, 29, 'Sports'),
('How many attempts do athletes get in shot put?', '2', '3', '4', '6', 'D', 'Athletics', 7, 30, 'Sports'),

-- General Sports questions
('What sport is played at Wimbledon?', 'Golf', 'Tennis', 'Cricket', 'Rugby', 'B', 'General Sports', 6, 31, 'Sports'),
('How many players are in a volleyball team on court?', '5', '6', '7', '8', 'B', 'Volleyball', 6, 32, 'Sports'),
('What is the highest score possible in ten-pin bowling?', '200', '250', '300', '350', 'C', 'Bowling', 7, 33, 'Sports'),
('Which sport uses a shuttlecock?', 'Tennis', 'Badminton', 'Squash', 'Table tennis', 'B', 'Badminton', 6, 34, 'Sports'),
('What does FIFA stand for?', 'Football International Federation Association', 'Fédération Internationale de Football Association', 'Federation of International Football Associations', 'Football International Association', 'B', 'Football', 9, 35, 'Sports'),

-- More football questions
('Which country has won the most World Cups?', 'Germany', 'Argentina', 'Brazil', 'Italy', 'C', 'Football', 8, 36, 'Sports'),
('What is a hat-trick in football?', 'Three goals by one player', 'Three saves by goalkeeper', 'Three yellow cards', 'Three substitutions', 'A', 'Football', 7, 37, 'Sports'),
('How long is a football penalty shootout?', '5 penalties each', 'Until someone misses', 'Best of 3', 'Sudden death', 'A', 'Football', 8, 38, 'Sports'),
('What is the penalty area also called?', 'Goal box', 'Penalty box', '18-yard box', 'All of the above', 'D', 'Football', 7, 39, 'Sports'),
('Which position cannot use hands in football?', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'A', 'Football', 6, 40, 'Sports'),

-- Cycling questions
('What is the most famous cycling race?', 'Giro d''Italia', 'Tour de France', 'Vuelta a España', 'Paris-Roubaix', 'B', 'Cycling', 8, 41, 'Sports'),
('How many stages are typically in Tour de France?', '18', '21', '24', '28', 'B', 'Cycling', 9, 42, 'Sports'),
('What jersey does the Tour de France leader wear?', 'Green', 'Yellow', 'Red', 'Blue', 'B', 'Cycling', 7, 43, 'Sports'),
('What is a peloton in cycling?', 'Single cyclist', 'Main group of cyclists', 'Cycling track', 'Finish line', 'B', 'Cycling', 7, 44, 'Sports'),
('How many wheels does a standard bicycle have?', '1', '2', '3', '4', 'B', 'Cycling', 6, 45, 'Sports'),

-- Golf questions
('How many holes are in a standard golf course?', '16', '18', '20', '24', 'B', 'Golf', 7, 46, 'Sports'),
('What is par in golf?', 'Maximum score', 'Expected score for hole', 'Minimum score', 'Winning score', 'B', 'Golf', 8, 47, 'Sports'),
('What is a birdie in golf?', 'One under par', 'Two under par', 'One over par', 'Equal to par', 'A', 'Golf', 8, 48, 'Sports'),
('What do you call the area where you tee off?', 'Fairway', 'Green', 'Tee box', 'Rough', 'C', 'Golf', 7, 49, 'Sports'),
('What is the golf club used on the green?', 'Driver', 'Iron', 'Putter', 'Wedge', 'C', 'Golf', 7, 50, 'Sports');