from django.db import models
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Game, Review, UserProfile
import random


class Command(BaseCommand):
    help = 'Populate database with sample video games and reviews'

    def handle(self, *args, **kwargs):
        self.stdout.write('[*] Seeding database...')

        # Clear existing data
        Review.objects.all().delete()
        Game.objects.all().delete()

        # -----------------------------------------------
        # Create demo users
        # -----------------------------------------------
        demo_users = []
        user_data = [
            ('gamer_pro', 'pro@example.com', 'Competitive gamer and hardware enthusiast'),
            ('gamer_sarah', 'sarah@example.com', 'RPG and story-driven game lover'),
            ('reviewer_mike', 'mike@example.com', 'I review every indie game I find'),
            ('pixel_warrior', 'pixel@example.com', 'Retro and platformer fan'),
            ('quest_master', 'quest@example.com', 'Dungeon crawler and MMO expert'),
        ]

        for username, email, bio in user_data:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': email}
            )
            if created:
                user.set_password('password123')
                user.save()
            UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'bio': bio,
                    'avatar_url': f'https://api.dicebear.com/7.x/avataaars/svg?seed={username}'
                }
            )
            demo_users.append(user)
        self.stdout.write(f'  [OK] Created {len(demo_users)} demo users')

        # -----------------------------------------------
        # Create 20 Video Games
        # -----------------------------------------------
        games_data = [
            {
                'title': 'Elden Ring',
                'poster_url': '/media/posters/games/Elden Ring.jpg',
                'genre': 'rpg',
                'year': 2022,
                'rating': 4.9,
                'description': 'Rise, Tarnished, and be led by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
                'developer': 'FromSoftware',
                'platform': 'multi',
                'is_featured': True,
            },
            {
                'title': 'God of War Ragnarok',
                'poster_url': '/media/posters/games/God of War Ragnarok.jpg',
                'genre': 'action',
                'year': 2022,
                'rating': 4.8,
                'description': 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.',
                'developer': 'Santa Monica Studio',
                'platform': 'playstation',
                'is_featured': True,
            },
            {
                'title': 'The Last of Us Part II',
                'poster_url': '/media/posters/games/The Last of Us Part II.jpg',
                'genre': 'action',
                'year': 2020,
                'rating': 4.7,
                'description': 'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.',
                'developer': 'Naughty Dog',
                'platform': 'playstation',
                'is_featured': True,
            },
            {
                'title': 'Cyberpunk 2077',
                'poster_url': '/media/posters/games/Cyberpunk 2077.jpg',
                'genre': 'rpg',
                'year': 2020,
                'rating': 4.3,
                'description': 'Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
                'developer': 'CD Projekt Red',
                'platform': 'pc',
                'is_featured': True,
            },
            {
                'title': 'Hades',
                'poster_url': '/media/posters/games/Hades.jpg',
                'genre': 'action',
                'year': 2020,
                'rating': 4.9,
                'description': 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.',
                'developer': 'Supergiant Games',
                'platform': 'multi',
                'is_featured': True,
            },
            {
                'title': 'Red Dead Redemption 2',
                'poster_url': '/media/posters/games/Red Dead Redemption 2.jpg',
                'genre': 'adventure',
                'year': 2018,
                'rating': 4.9,
                'description': 'Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive.',
                'developer': 'Rockstar Games',
                'platform': 'multi',
            },
            {
                'title': 'The Legend of Zelda: Tears of the Kingdom',
                'poster_url': '/media/posters/games/The Legend of Zelda - Tears of the Kingdom.jpg',
                'genre': 'adventure',
                'year': 2023,
                'rating': 4.9,
                'description': 'An epic adventure across the land and skies of Hyrule awaits in the Sequel to The Legend of Zelda: Breath of the Wild.',
                'developer': 'Nintendo',
                'platform': 'nintendo',
            },
            {
                'title': "Baldur's Gate 3",
                'poster_url': "/media/posters/games/Baldur's Gate 3.jpg",
                'genre': 'rpg',
                'year': 2023,
                'rating': 4.9,
                'description': 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
                'developer': 'Larian Studios',
                'platform': 'pc',
            },
            {
                'title': 'Spider-Man 2',
                'poster_url': '/media/posters/games/Spider-Man 2.png',
                'genre': 'action',
                'year': 2023,
                'rating': 4.8,
                'description': "Spider-Men Peter Parker and Miles Morales return for an exciting new adventure in the critically acclaimed Marvel's Spider-Man franchise.",
                'developer': 'Insomniac Games',
                'platform': 'playstation',
            },
            {
                'title': 'Starfield',
                'poster_url': '/media/posters/games/Starfield.jpg',
                'genre': 'rpg',
                'year': 2023,
                'rating': 4.2,
                'description': 'In this next-generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom as you embark on an epic journey to answer humanity’s greatest mystery.',
                'developer': 'Bethesda Game Studios',
                'platform': 'xbox',
            },
            {
                'title': 'Resident Evil 4 Remake',
                'poster_url': '/media/posters/games/Resident Evil 4 Remake.jpg',
                'genre': 'horror',
                'year': 2023,
                'rating': 4.8,
                'description': "Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, has been dispatched to rescue the president's kidnapped daughter.",
                'developer': 'Capcom',
                'platform': 'multi',
            },
            {
                'title': 'Final Fantasy XVI',
                'poster_url': '/media/posters/games/Final Fantasy XVI.png',
                'genre': 'rpg',
                'year': 2023,
                'rating': 4.6,
                'description': 'An epic dark fantasy world where the fate of the land is decided by the mighty Eikons and the Dominants who wield them.',
                'developer': 'Square Enix',
                'platform': 'playstation',
            },
            {
                'title': 'Ghost of Tsushima',
                'poster_url': '/media/posters/games/Ghost of Tsushima.jpg',
                'genre': 'action',
                'year': 2020,
                'rating': 4.9,
                'description': 'In the late 13th century, the Mongol empire has laid waste to entire nations along their campaign to conquer the East. Tsushima Island is all that stands between mainland Japan and a massive Mongol invasion fleet.',
                'developer': 'Sucker Punch Productions',
                'platform': 'playstation',
            },
            {
                'title': 'Forza Horizon 5',
                'poster_url': '/media/posters/games/Forza Horizon 5.jpg',
                'genre': 'racing',
                'year': 2021,
                'rating': 4.7,
                'description': 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.',
                'developer': 'Playground Games',
                'platform': 'xbox',
            },
            {
                'title': 'Minecraft',
                'poster_url': '/media/posters/games/Minecraft.jpg',
                'genre': 'simulation',
                'year': 2011,
                'rating': 4.9,
                'description': 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.',
                'developer': 'Mojang Studios',
                'platform': 'multi',
            },
            {
                'title': 'Street Fighter 6',
                'poster_url': '/media/posters/games/Street Fighter 6.jpg',
                'genre': 'fighting',
                'year': 2023,
                'rating': 4.7,
                'description': 'Powered by Capcom’s proprietary RE ENGINE, the Street Fighter 6 experience spans across three distinct game modes featuring World Tour, Fighting Ground and Battle Hub.',
                'developer': 'Capcom',
                'platform': 'multi',
            },
            {
                'title': 'Diablo IV',
                'poster_url': '/media/posters/games/Diablo IV.jpg',
                'genre': 'rpg',
                'year': 2023,
                'rating': 4.5,
                'description': 'The endless battle between the High Heavens and the Burning Hells rages on as chaos threatens to consume Sanctuary.',
                'developer': 'Blizzard Entertainment',
                'platform': 'multi',
            },
            {
                'title': 'Hi-Fi RUSH',
                'poster_url': '/media/posters/games/Hi-Fi RUSH.jpg',
                'genre': 'action',
                'year': 2023,
                'rating': 4.8,
                'description': 'Feel the beat as wannabe rockstar Chai and his ragtag team of allies rebel against an evil tech megacorp with raucous rhythm combat!',
                'developer': 'Tango Gameworks',
                'platform': 'pc',
            },
            {
                'title': 'Alan Wake 2',
                'poster_url': '/media/posters/games/Alan Wake 2.jpg',
                'genre': 'horror',
                'year': 2023,
                'rating': 4.9,
                'description': 'A string of ritualistic murders threatens Bright Falls, a small-town community surrounded by Pacific Northwest wilderness. Saga Anderson, an accomplished FBI agent, arrives to investigate.',
                'developer': 'Remedy Entertainment',
                'platform': 'multi',
            },
            {
                'title': 'Armored Core VI',
                'poster_url': '/media/posters/games/Armored Core VI.png',
                'genre': 'action',
                'year': 2023,
                'rating': 4.7,
                'description': 'A mysterious new substance was discovered on the remote planet, Rubicon 3. As an energy source, this substance was expected to dramatically advance humanity’s technological and communications capabilities.',
                'developer': 'FromSoftware',
                'platform': 'multi',
            },
        ]

        games = [Game.objects.create(**data) for data in games_data]
        self.stdout.write(f'  [OK] Created {len(games)} games')

        # -----------------------------------------------
        # Create Sample Reviews
        # -----------------------------------------------
        comments = [
            "What an absolute masterpiece! The gameplay is flawless.",
            "Best game I've played this year. Highly recommended.",
            "Incredible visuals and an even better soundtrack.",
            "The story kept me hooked from beginning to end.",
            "A must-play for any fan of the genre.",
            "Some technical issues at launch, but fixed now and it's great.",
            "I've already put 100 hours into this and I'm not stopping.",
            "A bit challenging but very rewarding.",
            "The open world is so immersive and full of life.",
            "One of the greatest of all time."
        ]

        for game in games:
            num_reviews = random.randint(2, 5)
            reviewers = random.sample(demo_users, num_reviews)
            for user in reviewers:
                Review.objects.create(
                    user=user,
                    game=game,
                    rating=random.randint(4, 5),
                    comment=random.choice(comments),
                )
        
        # Update ratings based on reviews
        for game in Game.objects.all():
            avg = Review.objects.filter(game=game).aggregate(avg_rating=models.Avg('rating'))['avg_rating']
            if avg:
                game.rating = round(avg, 1)
                game.save()

        self.stdout.write(self.style.SUCCESS('[DONE] Database seeded successfully!'))
