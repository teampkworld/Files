
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Smile, ArrowRight } from "lucide-react";

const EmojiReplacer = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [replacementMode, setReplacementMode] = useState<"text" | "emoji" | "custom">("text");
  const [customReplacement, setCustomReplacement] = useState("");
  const [preserveShortcodes, setPreserveShortcodes] = useState(true);
  const [caseMode, setCaseMode] = useState<"keep" | "lower" | "upper" | "title">("keep");
  const [addBrackets, setAddBrackets] = useState(false);
  const { toast } = useToast();

  // Comprehensive emoji to text mappings
  const emojiToText: Record<string, string> = {
    # ========== 1. SMILEYS & EMOTION ==========
    '😀': 'grinning',               '😃': 'smiley',                  '😄': 'smile',                   '😁': 'grin',
    '😆': 'laughing',              '😅': 'sweat_smile',            '🤣': 'rolling_on_floor_laughing', '😂': 'joy',
    '🙂': 'slightly_smiling',      '🙃': 'upside_down',             '😉': 'wink',                   '😊': 'blush',
    '😇': 'innocent',              '🥰': 'smiling_face_with_hearts', '😍': 'heart_eyes',            '🤩': 'star_struck',
    '😘': 'kissing_heart',         '😗': 'kissing',                '😙': 'kissing_smiling_eyes',   '😚': 'kissing_closed_eyes',
    '😋': 'savoring_food',         '😛': 'playful_tongue',         '😝': 'squinting_tongue',        '😜': 'winking_tongue',
    '🤪': 'zany_face',             '🤨': 'skeptical',              '🧐': 'thinking',               '😐': 'neutral_face',
    '😑': 'expressionless',        '😶': 'no_mouth',               '😏': 'smirk',                  '😒': 'unamused',
    '😞': 'disappointed',          '😟': 'worried',                '😠': 'angry',                  '😡': 'rage',
    '😤': 'steaming_mad',          '😢': 'crying',                 '😭': 'sobbing',                '😥': 'sad_but_relieved',
    '😣': 'persevering',           '😖': 'confounded',             '😫': 'tired_face',             '😩': 'weary',
    '😰': 'anxious',               '😱': 'screaming_in_fear',      '😳': 'flushed',                '🥵': 'hot_face',
    '🥶': 'cold_face',              '😵': 'dizzy_face',             '🤒': 'sick',                   '🤕': 'injured',
    '🤢': 'nauseated',             '🤮': 'vomiting',               '🤧': 'sneezing',               '😷': 'masked_face',
    '🤔': 'thoughtful',            '🤗': 'hugging_face',          '😌': 'relieved',               '😇': 'halo',
    '😈': 'devilish',               '👿': 'ogre',                  '👹': 'goblin',                 '👺': 'japanese_goblin',
    '💀': 'skull',                 '☠️': 'skull_and_crossbones',   '👻': 'ghost',                  '💩': 'poop',
    '🤡': 'clown',                 '😺': 'smiling_cat',            '😸': 'grinning_cat',           '😹': 'cat_with_joy',
    '😻': 'heart_eyes_cat',         '😼': 'smirking_cat',           '😽': 'kissing_cat',            '🙀': 'weary_cat',
    '😿': 'crying_cat',            '😾': 'pouting_cat',             '🙈': 'see_no_evil',            '🙉': 'hear_no_evil',
    '🙊': 'speak_no_evil',          '💋': 'kiss_mark',              '😘': 'blowing_kiss',           '😗': 'kissing_face',
    '😙': 'kissing_smiling_eyes',   '😚': 'kissing_closed_eyes',     '😍': 'smiling_face_with_heart_eyes', '🤩': 'star_struck',

    # ========== 2. GESTURES & BODY PARTS ==========
    '👋': 'waving_hand',            '🙏': 'folded_hands',            '🤝': 'handshake',              '👍': 'thumbs_up',
    '👎': 'thumbs_down',           '👊': 'fisted_hand',            '🤛': 'left_fist',              '🤜': 'right_fist',
    '👌': 'ok_hand',               '🤏': 'pinched_fingers',        '🤞': 'crossed_fingers',        '✌️': 'victory_hand',
    '🤟': 'love_you_gesture',      '🤘': 'sign_of_the_horns',      '👉': 'pointing_right',         '👈': 'pointing_left',
    '👆': 'pointing_up',            '👇': 'pointing_down',          '☝️': 'index_pointing_up',       '👋': 'raised_hand',
    '🖐️': 'raised_hand_fingers_splayed', '👏': 'clapping_hands',   '🙌': 'raising_hands',          '🤲': 'open_hands',
    '🤗': 'hugging_face',          '💪': 'flexed_biceps',          '🦾': 'mechanical_arm',        '🦿': 'mechanical_leg',
    '🦵': 'leg',                   '🦶': 'foot',                  '👂': 'ear',                    '👃': 'nose',
    '👅': 'tongue',                '👀': 'eyes',                  '👁️': 'eye',                   '👄': 'mouth',
    '🦷': 'tooth',                 '🦴': 'bone',                  '🧠': 'brain',                  '🫀': 'lungs',
    '🫁': 'heart',                 '🫂': 'people_hugging',        '🤝': 'handshake',              '👫': 'two_people',
    '👬': 'two_men',                '👭': 'two_women',              '🧑‍🤝‍🧑': 'people_holding_hands', '💏': 'kiss',
    '👩‍❤️‍💋‍👨': 'kiss_woman_man', '👨‍❤️‍💋‍👨': 'kiss_man_man', '👩‍❤️‍💋‍👩': 'kiss_woman_woman', '👪': 'family',
    '🧑‍🤝‍🧑': 'people_holding_hands', '👨‍👩‍👧': 'family_man_woman_girl', '👨‍👩‍👦': 'family_man_woman_boy', '👨‍👩‍👧‍👦': 'family_man_woman_girl_boy',
    '👨‍👩‍👦‍👦': 'family_man_woman_two_boys', '👨‍👩‍👧‍👧': 'family_man_woman_two_girls', '👨‍👨‍👦': 'family_two_men_boy', '👩‍👩‍👦': 'family_two_women_boy',
    '👨‍👦': 'man_and_boy',         '👨‍👧': 'man_and_girl',          '👩‍👦': 'woman_and_boy',         '👩‍👧': 'woman_and_girl',
    '🧑‍🦼': 'person_in_motorized_wheelchair', '🧑‍🦽': 'person_in_manual_wheelchair', '👨‍🦼': 'man_in_motorized_wheelchair', '👨‍🦽': 'man_in_manual_wheelchair',
    '👩‍🦼': 'woman_in_motorized_wheelchair', '👩‍🦽': 'woman_in_manual_wheelchair', '🏃': 'runner', '🏃‍♀️': 'woman_running',

    # ========== 3. OBJECTS & SYMBOLS ==========
    '📱': 'mobile_phone',           '💻': 'laptop',                 '🖥️': 'desktop_computer',      '🖨️': 'printer',
    '🖱️': 'computer_mouse',        '🔋': 'battery',                '🔌': 'electric_plug',          '💡': 'light_bulb',
    '🔦': 'flashlight',             '🕯️': 'candle',               '📺': 'television',              '🎮': 'video_game_controller',
    '🎧': 'headphones',             '📼': 'videocassette',          '💽': 'cd_disc',                 '💾': 'floppy_disk',
    '📷': 'camera',                '🎥': 'movie_camera',          '📹': 'video_camera',           '📽️': 'film_projector',
    '🎬': 'clapper_board',          '📟': 'pager',                 '📠': 'fax_machine',            '📡': 'satellite_antenna',
    '📶': 'antenna_bars',           '📳': 'smartphone',             '☎️': 'telephone',               '📞': 'telephone_receiver',
    '🔑': 'key',                   '🔒': 'locked',                '🔓': 'unlocked',               '🔏': 'locked_with_key',
    '🔨': 'hammer',                '⛏️': 'pick',                  '⚒️': 'hammer_and_pick',        '🛠️': 'tools',
    '🔧': 'wrench',                 '🔩': 'nut_and_bolt',          '⚙️': 'gear',                   '🗜️': 'clamp',
    '⚖️': 'balance_scale',         '🦯': 'white_cane',            '🔗': 'link',                   '⛓️': 'chains',
    '🔪': 'knife',                 '🗡️': 'dagger',               '⚔️': 'crossed_swords',         '🛡️': 'shield',
    '💊': 'pill',                  '💉': 'syringe',               '🩹': 'bandage',                '🩺': 'stethoscope',
    '🧪': 'test_tube',              '🧫': 'petri_dish',            '🧬': 'dna',                    '🔬': 'microscope',
    '🔭': 'telescope',              '📡': 'satellite_antenna',     '🩸': 'drop_of_blood',          '🦴': 'bone',
    '🦷': 'tooth',                 '🧠': 'brain',                 '🫀': 'lungs',                  '🫁': 'heart',
    '🩺': 'stethoscope',            '🩹': 'adhesive_bandage',       '🩼': 'scalpel',                '👓': 'glasses',
    '🕶️': 'sunglasses',            '🧥': 'coat',                  '👔': 'lab_coat',               '👕': 't_shirt',
    '👖': 'jeans',                 '🧣': 'scarf',                 '🧤': 'gloves',                 '🧦': 'socks',
    '👟': 'running_shoe',           '👠': 'womans_shoe',            '👡': 'sandal',                  '🩴': 'flat_shoe',
    '👢': 'high_heeled_shoe',       '👣': 'footprints',             '🎩': 'top_hat',                '👒': 'billed_cap',
    '🎓': 'graduation_cap',         '🧢': 'billed_cap',            '👑': 'crown',                  '👛': 'purse',
    '👜': 'handbag',                '👝': 'clutch_bag',            '🛍️': 'shopping_bags',          '🎒': 'backpack',
    '❤️': 'red_heart',              '🧡': 'orange_heart',          '💛': 'yellow_heart',           '💚': 'green_heart',
    '💙': 'blue_heart',             '💜': 'purple_heart',          '🖤': 'black_heart',            '🤍': 'white_heart',
    '💯': 'hundred_points',          '💢': 'anger_symbol',          '💥': 'collision',               '💫': 'dizzy',
    '💦': 'sweat_droplets',          '💨': 'dashing_away',           '🌪️': 'tornado',                '💣': 'bomb',
    '💬': 'speech_bubble',          '🗣️': 'speaking_head',         '👤': 'bust_in_silhouette',      '👥': 'busts_in_silhouette',
    '🫂': 'people_hugging',         '👣': 'footprints',            '🦶': 'foot',                   '🦵': 'leg',
    '🦿': 'mechanical_leg',          '🦾': 'mechanical_arm',        '🪑': 'chair',                  '🛋️': 'couch_and_lamp',
    '🚪': 'door',                  '🛏️': 'bed',                 '🪞': 'mirror',                 '🪟': 'window',
    '🪠': 'placard',               '🧹': 'broom',                 '🧺': 'laundry',                '🧻': 'toilet_paper',
    '🧼': 'soap',                  '🧽': 'sponge',                '🧯': 'fire_extinguisher',      '🛒': 'shopping_cart',

    # ========== 4. NATURE & ANIMALS ==========
    '🐶': 'dog',                   '🐱': 'cat',                    '🐭': 'mouse',                  '🐹': 'hamster',
    '🐰': 'rabbit',                '🦊': 'fox',                    '🐻': 'bear',                   '🐼': 'panda',
    '🐨': 'koala',                 '🐯': 'tiger',                 '🦁': 'lion',                   '🐮': 'cow',
    '🐷': 'pig',                   '🐽': 'pig_nose',              '🐸': 'frog',                   '🐵': 'monkey',
    '🙈': 'see_no_evil_monkey',      '🙉': 'hear_no_evil_monkey',   '🙊': 'speak_no_evil_monkey',   '🐔': 'chicken',
    '🐣': 'hatching_chick',          '🐤': 'baby_chick',            '🐥': 'front_facing_baby_chick', '🐦': 'bird',
    '🐧': 'penguin',                '🕊️': 'dove',                 '🦅': 'eagle',                  '🦆': 'duck',
    '🦢': 'swan',                  '🦉': 'owl',                   '🦇': 'bat',                    '🐺': 'wolf',
    '🐍': 'snake',                 '🐲': 'dragon',                '🐉': 'dragon_face',            '🦎': 'lizard',
    '🐊': 'crocodile',              '🐢': 'turtle',                '🦈': 'shark',                  '🐋': 'whale',
    '🐬': 'dolphin',                '🐟': 'fish',                  '🐠': 'tropical_fish',          '🐡': 'blowfish',
    '🦑': 'squid',                 '🦞': 'lobster',               '🦀': 'crab',                   '🦐': 'shrimp',
    '🦭': 'seal',                  '🐌': 'snail',                 '🐛': 'bug',                    '🦋': 'butterfly',
    '🐝': 'honeybee',               '🐞': 'lady_beetle',           '🦗': 'cricket',                '🕷️': 'spider',
    '🕸️': 'spider_web',            '🐜': 'ant',                   '🦟': 'mosquito',               '🪲': 'fly',
    '🪳': 'worm',                  '🪰': 'moth',                  '🦂': 'scorpion',               '🌱': 'seedling',
    '🌿': 'leaf_fluttering_in_wind', '🍃': 'fallen_leaf',           '🍂': 'leaves',                 '🍁': 'maple_leaf',
    '🌲': 'evergreen_tree',         '🌳': 'deciduous_tree',         '🌴': 'palm_tree',              '🌵': 'cactus',
    '🌺': 'hibiscus',               '🌸': 'cherry_blossom',         '🌼': 'blossom',                '🌹': 'rose',
    '🥀': 'wilted_flower',          '🌷': 'tulip',                 '🌻': 'sunflower',              '🍀': 'four_leaf_clover',
    '🌰': 'chestnut',               '🍄': 'mushroom',              '🌾': 'sheaf_of_rice',          '🌅': 'sunrise',

    # ========== 5. TRAVEL & PLACES ==========
    '🚗': 'automobile',             '🚕': 'taxi',                  '🚙': 'sport_utility_vehicle',   '🚚': 'delivery_truck',
    '🚛': 'articulated_lorry',      '🚜': 'tractor',                '🏎️': 'racing_car',             '🏍️': 'motorcycle',
    '🛵': 'motor_scooter',          '🚲': 'bicycle',                '🛴': 'kick_scooter',           '🛹': 'skateboard',
    '🛼': 'roller_skate',           '🚡': 'aerial_tramway',         '🚠': 'mountain_cableway',       '🚟': 'suspension_railway',
    '🚃': 'mountain_railway',       '🚋': 'tram_car',               '🚌': 'bus',                    '🚎': 'oncoming_bus',
    '🚐': 'minibus',                '🚑': 'ambulance',              '🚒': 'fire_engine',             '🚓': 'police_car',
    '🚔': 'oncoming_police_car',     '🚍': 'school_bus',             '✈️': 'airplane',               '🛩️': 'small_airplane',
    '🛫': 'airplane_departure',      '🛬': 'airplane_arrival',       '🪂': 'parachute',               '🚁': 'helicopter',
    '🚀': 'rocket',                 '🛸': 'flying_saucer',          '🛳️': 'passenger_ship',         '⛴️': 'ferry',
    '🛥️': 'motor_boat',            '🚤': 'speedboat',              '🛶': 'canoe',                   '🚣': 'rowboat',
    '🌍': 'earth_globe_europe_africa', '🌎': 'earth_globe_americas', '🌏': 'earth_globe_asia_australia', '🌐': 'globe_with_meridians',
    '🗺️': 'world_map',              '🗾': 'mount_fuji',             '🏔️': 'mountain',               '🌋': 'volcano',
    '🏕️': 'camping',               '🏖️': 'beach_with_umbrella',   '🏜️': 'desert',                 '🏝️': 'desert_island',
    '🏞️': 'national_park',          '🌅': 'sunrise',                '🌄': 'sunset',                  '🌇': 'cityscape_at_dusk',
    '🌉': 'bridge_at_night',         '🏙️': 'cityscape',              '🏠': 'house',                   '🏡': 'house_with_garden',
    '🏘️': 'houses',                '🏚️': 'derelict_house',        '🏗️': 'building_construction',   '🏭': 'factory',
    '🏢': 'office_building',        '🏣': 'japanese_post_office',   '🏤': 'european_post_office',    '🏥': 'hospital',
    '🏦': 'bank',                  '🏨': 'hotel',                  '🏪': 'convenience_store',       '🏫': 'school',
    '🏬': 'department_store',       '🏯': 'japanese_castle',        '🏰': 'castle',                  '🗼': 'tokyo_tower',
    '🗽': 'statue_of_liberty',      '⛪': 'church',                 '🕌': 'mosque',                  '🕍': 'synagogue',
    '🛕': 'hindu_temple',           '🕋': 'kaaba',                  '⛩️': 'shinto_shrine',           '🏛️': 'classical_building',

    # ========== 6. ACTIVITIES & SPORTS ==========
    '⚽': 'soccer_ball',             '🏀': 'basketball',              '🏈': 'american_football',       '⚾': 'baseball',
    '🎾': 'tennis',                 '🏐': 'volleyball',              '🏉': 'rugby_football',          '🎱': 'billiards',
    '🏓': 'ping_pong',               '🏸': 'badminton',               '🥊': 'boxing_glove',            '🥋': 'martial_arts_uniform',
    '🎯': 'direct_hit',              '🎳': 'bowling',                 '🎮': 'video_game',              '🎰': 'slot_machine',
    '🎲': 'game_die',               '🧩': 'puzzle_piece',            '🎣': 'fishing_pole',            '🎭': 'performing_arts',
    '🎨': 'artist_palette',          '🎬': 'clapper_board',           '📽️': 'film_frames',            '🎤': 'microphone',
    '🎧': 'headphones',              '🎷': 'saxophone',               '🎹': 'musical_keyboard',         '🎺': 'trumpet',
    '🎻': 'violin',                 '🥁': 'drum',                   '🪕': 'banjo',                  '🎵': 'musical_note',
    '🎶': 'musical_notes',           '📚': 'books',                  '📖': 'open_book',               '📕': 'green_book',
    '📗': 'blue_book',               '📘': 'orange_book',            '📙': 'book',                   '📔': 'notebook',
    '📒': 'ledger',                 '📓': 'closed_book',             '📏': 'straight_ruler',          '📐': 'triangular_ruler',
    '✏️': 'pencil',                 '✒️': 'black_nib',              '🖋️': 'fountain_pen',           '🖊️': 'pen',
    '🖌️': 'paintbrush',            '🖍️': 'crayon',                 '📝': 'memo',                    '📜': 'scroll',
    '📃': 'page_with_curl',          '📄': 'page_facing_up',          '📰': 'newspaper',               '🗞️': 'rolled_up_newspaper',
    '📑': 'bookmark_tabs',           '🔖': 'bookmark',               '📎': 'paperclip',              '🖇️': 'linked_paperclips',
    '📌': 'pushpin',                 '📍': 'round_pushpin',           '📊': 'bar_chart',               '📈': 'chart_increasing',
    '📉': 'chart_decreasing',        '🗃️': 'card_file_box',          '🗄️': 'file_cabinet',           '🗑️': 'wastebasket',
    '🏃': 'runner',                  '🏃‍♀️': 'woman_running',       '🏃‍♂️': 'man_running',           '💃': 'woman_dancing',
    '🕺': 'man_dancing',              '🕴️': 'man_in_suit_levitating', '👯': 'women_with_bunny_ears',   '🧘': 'person_in_lotus_position',
    '🛀': 'person_taking_bath',       '🛌': 'person_in_bed',          '🧗': 'person_climbing',         '🤸': 'person_doing_cartwheel',
    '🤼': 'wrestlers',               '🤽': 'person_playing_water_polo', '🤹': 'person_juggling',       '🚣': 'rowboat',
    '🏊': 'swimmer',                 '⛹️': 'person_bouncing_ball',   '🤾': 'person_playing_handball', '🏋️': 'person_lifting_weights',
    '🚴': 'cyclist',                 '🏄': 'person_surfing',         '🏇': 'horse_racing',            '🎽': 'running_shirt_with_sash',
    '🥇': 'first_place_medal',        '🥈': 'second_place_medal',      '🥉': 'third_place_medal',        '🏆': 'trophy',

    # ========== 7. FLAGS (COUNTRIES) ==========
    '🇦🇫': 'afghanistan',           '🇦🇽': 'aland_islands',         '🇦🇱': 'albania',               '🇩🇿': 'algeria',
    '🇦🇸': 'american_samoa',        '🇦🇩': 'andorra',               '🇦🇴': 'angola',                '🇦🇮': 'anguilla',
    '🇦🇶': 'antarctica',            '🇦🇷': 'argentina',             '🇦🇲': 'armenia',               '🇦🇼': 'aruba',
    '🇦🇺': 'australia',              '🇦🇹': 'austria',               '🇦🇿': 'azerbaijan',            '🇧🇸': 'bahamas',
    '🇧🇭': 'bahrain',                '🇧🇩': 'bangladesh',            '🇧🇧': 'barbados',              '🇧🇾': 'belarus',
    '🇧🇪': 'belgium',               '🇧🇿': 'belize',                '🇧🇯': 'benin',                 '🇧🇲': 'bermuda',
    '🇧🇹': 'bhutan',                '🇧🇴': 'bolivia',               '🇧🇦': 'bosnia_and_herzegovina', '🇧🇼': 'botswana',
    '🇧🇷': 'brazil',                '🇮🇴': 'british_indian_ocean_territory', '🇻🇬': 'british_virgin_islands', '🇧🇳': 'brunei',
    '🇧🇬': 'bulgaria',              '🇧🇫': 'burkina_faso',          '🇧🇮': 'burundi',               '🇰🇭': 'cambodia',
    '🇨🇲': 'cameroon',              '🇨🇦': 'canada',                '🇮🇨': 'canary_islands',        '🇨🇻': 'cape_verde',
    '🇰🇾': 'cayman_islands',         '🇨🇫': 'central_african_republic', '🇹🇩': 'chad',                '🇨🇱': 'chile',
    '🇨🇳': 'china',                 '🇨🇽': 'christmas_island',      '🇨🇨': 'cocos_islands',         '🇨🇴': 'colombia',
    '🇰🇲': 'comoros',               '🇨🇬': 'congo_brazzaville',     '🇨🇩': 'congo_kinshasa',        '🇨🇰': 'cook_islands',
    '🇨🇷': 'costa_rica',            '🇭🇷': 'croatia',               '🇨🇺': 'cuba',                  '🇨🇼': 'curaçao',
    '🇨🇾': 'cyprus',                '🇨🇿': 'czech_republic',        '🇩🇰': 'denmark',               '🇩🇯': 'djibouti',
    '🇩🇲': 'dominica',              '🇩🇴': 'dominican_republic',   '🇪🇨': 'ecuador',               '🇪🇬': 'egypt',
    '🇸🇻': 'el_salvador',           '🇬🇶': 'equatorial_guinea',     '🇪🇷': 'eritrea',               '🇪🇪': 'estonia',
    '🇪🇹': 'ethiopia',              '🇪🇺': 'european_union',       '🇫🇰': 'falkland_islands',      '🇫🇴': 'faroe_islands',
    '🇫🇯': 'fiji',                  '🇫🇮': 'finland',              '🇫🇷': 'france',                '🇬🇫': 'french_guiana',
    '🇵🇫': 'french_polynesia',      '🇹🇫': 'french_southern_territories', '🇬🇦': 'gabon',          '🇬🇲': 'gambia',
    '🇬🇪': 'georgia',               '🇩🇪': 'germany',              '🇬🇭': 'ghana',                 '🇬🇮': 'gibraltar',
    '🇬🇷': 'greece',                '🇬🇱': 'greenland',            '🇬🇩': 'grenada',               '🇬🇵': 'guadeloupe',
    '🇬🇺': 'guam',                  '🇬🇹': 'guatemala',            '🇬🇬': 'guernsey',              '🇬🇳': 'guinea',
    '🇬🇼': 'guinea_bissau',          '🇬🇾': 'guyana',               '🇭🇹': 'haiti',                 '🇭🇲': 'heard_and_mcdonald_islands',
    '🇻🇦': 'holy_see',              '🇭🇳': 'honduras',              '🇭🇰': 'hong_kong',            '🇭🇺': 'hungary',
    '🇮🇸': 'iceland',               '🇮🇳': 'india',                 '🇮🇴': 'indian_ocean_territory', '🇮🇩': 'indonesia',
    '🇮🇷': 'iran',                  '🇮🇶': 'iraq',                 '🇮🇪': 'ireland',               '🇮🇲': 'isle_of_man',
    '🇮🇱': 'israel',                '🇮🇹': 'italy',                 '🇯🇲': 'jamaica',               '🇯🇵': 'japan',
    '🇯🇪': 'jersey',                '🇯🇴': 'jordan',                '🇰🇿': 'kazakhstan',            '🇰🇪': 'kenya',
    '🇰🇮': 'kiribati',              '🇽🇰': 'kosovo',                '🇰🇼': 'kuwait',                '🇰🇬': 'kyrgyzstan',
    '🇱🇦': 'laos',                  '🇱🇻': 'latvia',               '🇱🇧': 'lebanon',               '🇱🇸': 'lesotho',
    '🇱🇷': 'liberia',               '🇱🇾': 'libya',                '🇱🇮': 'liechtenstein',         '🇱🇹': 'lithuania',
    '🇱🇺': 'luxembourg',            '🇲🇴': 'macau',                 '🇲🇰': 'macedonia',             '🇲🇬': 'madagascar',
    '🇲🇼': 'malawi',                '🇲🇾': 'malaysia',             '🇲🇻': 'maldives',              '🇲🇱': 'mali',
    '🇲🇹': 'malta',                 '🇲🇭': 'marshall_islands',      '🇲🇶': 'martinique',            '🇲🇷': 'mauritania',
    '🇲🇺': 'mauritius',             '🇾🇹': 'mayotte',               '🇲🇽': 'mexico',                '🇫🇲': 'micronesia',
    '🇲🇩': 'moldova',               '🇲🇨': 'monaco',                '🇲🇳': 'mongolia',              '🇲🇪': 'montenegro',
    '🇲🇸': 'montserrat',            '🇲🇦': 'morocco',               '🇲🇿': 'mozambique',           '🇲🇲': 'myanmar',
    '🇳🇦': 'namibia',               '🇳🇷': 'nauru',                 '🇳🇵': 'nepal',                 '🇳🇱': 'netherlands',
    '🇳🇨': 'new_caledonia',          '🇳🇿': 'new_zealand',           '🇳🇮': 'nicaragua',              '🇳🇪': 'niger',
    '🇳🇬': 'nigeria',               '🇳🇺': 'niue',                  '🇳🇫': 'norfolk_island',        '🇰🇵': 'north_korea',
    '🇲🇰': 'north_macedonia',        '🇲🇵': 'northern_mariana_islands', '🇳🇴': 'norway',          '🇴🇲': 'oman',
    '🇵🇰': 'pakistan',              '🇵🇼': 'palau',                 '🇵🇸': 'palestinian_territories', '🇵🇦': 'panama',
    '🇵🇬': 'papua_new_guinea',      '🇵🇾': 'paraguay',              '🇵🇪': 'peru',                  '🇵🇭': 'philippines',
    '🇵🇳': 'pitcairn_islands',      '🇵🇱': 'poland',                '🇵🇹': 'portugal',              '🇵🇷': 'puerto_rico',
    '🇶🇦': 'qatar',                 '🇷🇴': 'romania',              '🇷🇺': 'russia',                '🇷🇼': 'rwanda',
    '🇷🇪': 'réunion',               '🇧🇱': 'saba',                  '🇸🇧': 'saint_barthélemy',       '🇸🇭': 'saint_helena',
    '🇰🇳': 'saint_kitts_and_nevis',  '🇱🇨': 'saint_lucia',           '🇲🇫': 'saint_martin',           '🇵🇲': 'saint_pierre_and_miquelon',
    '🇻🇨': 'saint_vincent_and_the_grenadines', '🇼🇸': 'samoa', '🇸🇲': 'san_marino', '🇸🇹': 'sao_tome_and_principe',
    '🇸🇦': 'saudi_arabia',          '🇸🇳': 'senegal',               '🇷🇸': 'serbia',                '🇸🇨': 'seychelles',
    '🇸🇱': 'sierra_leone',          '🇸🇬': 'singapore',             '🇸🇽': 'sint_maarten',           '🇸🇰': 'slovakia',
    '🇸🇮': 'slovenia',              '🇸🇧': 'solomon_islands',       '🇸🇴': 'somalia',               '🇿🇦': 'south_africa',
    '🇬🇸': 'south_georgia_and_south_sandwich_islands', '🇰🇷': 'south_korea', '🇸🇸': 'south_sudan', '🇪🇸': 'spain',
    '🇱🇰': 'sri_lanka',             '🇸🇩': 'sudan',                 '🇸🇷': 'suriname',              '🇸🇯': 'svalbard_and_jan_mayen',
    '🇸🇪': 'sweden',                '🇨🇭': 'switzerland',            '🇸🇾': 'syria',                 '🇹🇼': 'taiwan',
    '🇹🇯': 'tajikistan',            '🇹🇿': 'tanzania',              '🇹🇭': 'thailand',              '🇹🇬': 'togo',
    '🇹🇰': 'tokelau',               '🇹🇴': 'tonga',                 '🇹🇹': 'trinidad_and_tobago',   '🇹🇳': 'tunisia',
    '🇹🇷': 'turkey',                '🇹🇲': 'turkmenistan',          '🇹🇨': 'turks_and_caicos_islands', '🇹🇻': 'tuvalu',
    '🇺🇬': 'uganda',               '🇺🇦': 'ukraine',               '🇦🇪': 'united_arab_emirates', '🇬🇧': 'united_kingdom',
    '🇺🇸': 'united_states',         '🇺🇾': 'uruguay',               '🇺🇿': 'uzbekistan',            '🇻🇺': 'vanuatu',
    '🇻🇦': 'vatican_city',          '🇻🇪': 'venezuela',             '🇻🇳': 'vietnam',               '🇻🇬': 'british_virgin_islands',
    '🇼🇫': 'wallis_and_futuna',     '🇪🇭': 'western_sahara',         '🇾🇪': 'yemen',                 '🇿🇲': 'zambia',
    '🇿🇼': 'zimbabwe',              '🏳️‍🌈': 'rainbow_flag',        '🏳️‍⚧️': 'transgender_flag',     '🏴': 'scotland_flag',

    # ========== 8. OTHER SYMBOLS ==========
    '⃣': 'keycap_asterisk',         '🔟': 'keycap_10',              '🔠': 'input_latin_capital_letters', '🔡': 'input_latin_small_letters',
    '🔢': 'input_numbers',           '🔣': 'input_symbols',           '🔤': 'input_latin_letters',     '🅰️': 'keycap_a',
    '🆎': 'keycap_ab',               '🅱️': 'keycap_b',               '🆑': 'squared_cl',             '🆒': 'squared_cool',
    '🆓': 'squared_free',            'ℹ️': 'information',             '🆔': 'squared_id',              '🆖': 'squared_new',
    '🆗': 'squared_ok',              '🆘': 'squared_sos',             '🆙': 'squared_up',              '🆚': 'squared_vs',
    '🈁': 'japanese_here_button',     '🈂️': 'japanese_service_charge', '🈷️': 'japanese_monthly_amount', '🈶': 'japanese_not_free_of_charge',
    '🈯': 'japanese_reserved_button', '🉐': 'japanese_bargain_button', '🈹': 'japanese_discount_button', '🤣': 'rolling_on_floor_laughing',
    '🈚': 'japanese_free_of_charge',  '🈲': 'japanese_prohibited',      '⛓️': 'chains',                 '🔗': 'link_symbol',
    '🈳': 'japanese_no_vacancy',     '🈵': 'japanese_no_entry',        '🉑': 'japanese_acceptable',     '🈸': 'japanese_application',
    '🈺': 'japanese_passing_grade',  '🈳': 'japanese_vacancy',        '🈲': 'japanese_congratulations', '🉒': 'japanese_secret',
    '🈂️': 'japanese_monthly',       '🈷️': 'japanese_no_smoking',    '🈶': 'japanese_no_littering',   '🚫': 'no_entry',
    '📛': 'name_badge',              '🔰': 'japanese_discount',        '🉓': 'japanese_open_for_business', '🈹': 'japanese_prohibited',
    '🈺': 'japanese_limited',         '🈵': 'japanese_service',        '🈳': 'japanese_call',           '🉑': 'japanese_ideograph',
    '🀄️': 'mahjong_red_dragon',     '🎴': 'playing_card_black_joker', '🀅': 'mahjong_tile',           '🎯': 'bullseye',
    '🎲': 'game_die',                '🧩': 'puzzle_piece',           '🎮': 'video_game',             '🎰': 'slot_machine',
    '🎳': 'bowling',                 '🏹': 'archery',                '🥌': 'curling_stone',          '🎣': 'fishing_pole',
    '🎭': 'performing_arts',         '🎨': 'artist_palette',         '🎪': 'circus_tent',           '🎪': 'circus_tent',
    '🎫': 'ticket',                  '🎟️': 'admission_tickets',      '🏆': 'trophy',                 '🥇': 'first_place_medal',
    '🥈': 'second_place_medal',      '🥉': 'third_place_medal',       '🏅': 'sports_medal',           '🎖️': 'military_medal',
    '🏵️': 'rosette',                '🎗️': 'reminder_ribbon',        '🎀': 'ribbon',                 '🎁': 'wrapped_gift',
    '🎈': 'balloon',                 '🎉': 'party_popper',           '🎊': 'confetti_ball',          '🎎': 'japanese_dolls',
    '🎏': 'carp_streamer',           '🎐': 'wind_chime',             '🎑': 'moon_viewing_ceremony',   '🎒': 'school_backpack',
    '📦': 'package',                 '📫': 'closed_mailbox_with_raised_flag', '📬': 'closed_mailbox_with_lowered_flag', '📭': 'open_mailbox',
    '📮': 'postbox',                 '📯': 'postal_horn',           '📜': 'scroll',                 '📞': 'telephone_receiver',
    '📟': 'pager',                   '📠': 'fax_machine',           '🖨️': 'printer',               '🖱️': 'computer_mouse',
    '🖲': 'trackball',               '💽': 'optical_disc',            '💾': 'floppy_disk',             '💿': 'cd_disc',
    '📀': 'dvd',                     '🎥': 'movie_camera',           '📹': 'video_camera',           '📷': 'camera',
    '📺': 'television',              '📻': 'radio',                  '🎙️': 'studio_microphone',      '🎚️': 'level_slider',
    '🎛️': 'control_knobs',          '🔊': 'speaker',                 '🔇': 'speaker_with_cancellation_stroke', '🔈': 'speaker_with_one_sound_wave',
    '🔉': 'speaker_with_three_sound_waves', '📢': 'public_address_loudspeaker', '📣': 'cheering_megaphone', '📏': 'straight_ruler',
    '📐': 'triangular_ruler',        '✂️': 'scissors',               '🗃️': 'card_file_box',          '🗄️': 'file_cabinet',
    '🗑️': 'wastebasket',            '🔑': 'key',                    '🔒': 'locked',                 '🔓': 'unlocked',
    '🔏': 'locked_with_key',         '🔐': 'old_key',                 '🔨': 'hammer',                 '🪓': 'axe',
    '⚒️': 'hammer_and_pick',        '🛠️': 'tools',                 '🔧': 'wrench',                 '🔩': 'nut_and_bolt',
    '⚙️': 'gear',                   '🗜️': 'clamp',                 '⚖️': 'balance_scale',         '🦯': 'white_cane',
    '🔗': 'link',                   '⛓️': 'chains',                 '💉': 'syringe',               '🩸': 'drop_of_blood',
    '🩹': 'adhesive_bandage',        '🩺': 'stethoscope',            '🧬': 'dna',                    '🔬': 'microscope',
    '🔭': 'telescope',               '📡': 'satellite_antenna',      '💊': 'pill',                   '💉': 'syringe',
    '🩹': 'bandage',                 '🧴': 'lotion_bottle',          '🧷': 'safety_pin',             '🧵': 'thread',
    '👓': 'glasses',                 '🕶️': 'sunglasses',            '🧣': 'scarf',                 '🧤': 'gloves',
    '🧦': 'socks',                   '👟': 'sneaker',                 '👠': 'womans_shoe',            '👡': 'sandal',
    '👢': 'boot',                   '👑': 'crown',                  '🎩': 'top_hat',                '👒': 'billed_cap',
    '🎓': 'graduation_cap',          '🧢': 'billed_cap',             '👝': 'clutch_bag',             '👜': 'handbag',
    '👛': 'purse',                   '🛍️': 'shopping_bags',         '🎒': 'backpack',               '❤️': 'red_heart',
    '🧡': 'orange_heart',            '💛': 'yellow_heart',           '💚': 'green_heart',            '💙': 'blue_heart',
    '💜': 'purple_heart',            '🖤': 'black_heart',            '🤍': 'white_heart',           '💔': 'broken_heart',
    '❤️‍🔥': 'heart_on_fire',       '❤️‍🩹': 'mending_heart',        '❤️‍🩺': 'heart_with_stethoscope', '💘': 'revolving_hearts',
    '💝': 'heart_with_arrow',        '💖': 'sparkling_heart',        '💗': 'growing_heart',           '💓': 'beating_heart',
    '💞': 'two_hearts',              '💕': 'revolving_hearts',       '💌': 'love_letter',             '💋': 'kiss_mark',
    '💍': 'ring',                   '💎': 'gem_stone',              '🎁': 'wrapped_gift',           '🎈': 'balloon',
    '🎉': 'party_popper',            '🎊': 'confetti_ball',           '🎎': 'japanese_dolls',         '🎏': 'carp_streamer',
    '🎐': 'wind_chime',              '🎑': 'moon_viewing_ceremony',   '🎓': 'graduation_cap',         '🎗️': 'reminder_ribbon',
    '🎟️': 'admission_tickets',      '🎫': 'ticket',                  '🏆': 'trophy',                 '🥇': 'first_place_medal',
    '🥈': 'second_place_medal',      '🥉': 'third_place_medal',       '🏅': 'sports_medal',           '🎖️': 'military_medal',
    '🏵️': 'rosette',                '🎀': 'ribbon',                 '🎁': 'wrapped_gift',           '🎈': 'balloon',
    '🎉': 'party_popper',            '🎊': 'confetti_ball',           '🎎': 'japanese_dolls',         '🎏': 'carp_streamer',
    '🎐': 'wind_chime',              '🎑': 'moon_viewing_ceremony',   '🎒': 'school_backpack',        '📦': 'package',
    '📫': 'closed_mailbox_with_raised_flag', '📬': 'closed_mailbox_with_lowered_flag', '📭': 'open_mailbox', '📮': 'postbox',
    '📯': 'postal_horn',             '📜': 'scroll',                 '📞': 'telephone_receiver',      '📟': 'pager',
    '📠': 'fax_machine',             '🖨️': 'printer',               '🖱️': 'computer_mouse',        '🖲': 'trackball',
    '💽': 'optical_disc',            '💾': 'floppy_disk',             '📀': 'dvd',                    '🎥': 'movie_camera',
    '📹': 'video_camera',            '📷': 'camera',                 '📺': 'television',              '📻': 'radio',
    '🎙️': 'studio_microphone',       '🎚️': 'level_slider',           '🎛️': 'control_knobs',          '🔊': 'speaker',
    '🔇': 'speaker_with_cancellation_stroke', '🔈': 'speaker_with_one_sound_wave', '🔉': 'speaker_with_three_sound_waves', '📢': 'public_address_loudspeaker',
    '📣': 'cheering_megaphone',      '📏': 'straight_ruler',          '📐': 'triangular_ruler',        '✂️': 'scissors',
    '🗃️': 'card_file_box',          '🗄️': 'file_cabinet',           '🗑️': 'wastebasket',            '🔑': 'key',
    '🔒': 'locked',                 '🔓': 'unlocked',               '🔏': 'locked_with_key',         '🔐': 'old_key',
    '🔨': 'hammer',                 '🪓': 'axe',                    '⚒️': 'hammer_and_pick',        '🛠️': 'tools',
    '🔧': 'wrench',                 '🔩': 'nut_and_bolt',          '⚙️': 'gear',                   '🗜️': 'clamp',
    '⚖️': 'balance_scale',          '🦯': 'white_cane',            '🔗': 'link',                   '⛓️': 'chains',
    '💉': 'syringe',                '🩸': 'drop_of_blood',          '🧬': 'dna',                    '🔬': 'microscope',
    '🔭': 'telescope',               '📡': 'satellite_antenna',      '💊': 'pill',                   '💉': 'syringe',
    '🩹': 'bandage',                '🧴': 'lotion_bottle',          '🧷': 'safety_pin',             '🧵': 'thread',
    '👓': 'glasses',                '🕶️': 'sunglasses',            '🧣': 'scarf',                 '🧤': 'gloves',
    '🧦': 'socks',                  '👟': 'sneaker',                '👠': 'womans_shoe',            '👡': 'sandal',
    '👢': 'boot',                  '👑': 'crown',                 '🎩': 'top_hat',                '👒': 'billed_cap',
    '🎓': 'graduation_cap',         '🧢': 'billed_cap',             '👝': 'clutch_bag',             '👜': 'handbag',
    '👛': 'purse',                  '🛍️': 'shopping_bags',         '🎒': 'backpack',               '❤️': 'red_heart',
    '🧡': 'orange_heart',           '💛': 'yellow_heart',           '💚': 'green_heart',            '💙': 'blue_heart',
    '💜': 'purple_heart',           '🖤': 'black_heart',            '🤍': 'white_heart',           '💔': 'broken_heart',
    '❤️‍🔥': 'heart_on_fire',       '❤️‍🩹': 'mending_heart',        '❤️‍🩺': 'heart_with_stethoscope', '💘': 'revolving_hearts',
    '💝': 'heart_with_arrow',       '💖': 'sparkling_heart',        '💗': 'growing_heart',           '💓': 'beating_heart',
    '💞': 'two_hearts',             '💕': 'revolving_hearts',       '💌': 'love_letter',             '💋': 'kiss_mark',
    '💍': 'ring',                  '💎': 'gem_stone',              '🎁': 'wrapped_gift',           '🎈': 'balloon',
    '🎉': 'party_popper',           '🎊': 'confetti_ball',           '🎎': 'japanese_dolls',         '🎏': 'carp_streamer',
    '🎐': 'wind_chime',             '🎑': 'moon_viewing_ceremony',   '🎒': 'school_backpack',        '📦': 'package',
    '📫': 'closed_mailbox_with_raised_flag', '📬': 'closed_mailbox_with_lowered_flag', '📭': 'open_mailbox', '📮': 'postbox',
    '📯': 'postal_horn',            '📜': 'scroll',                 '📞': 'telephone_receiver',      '📟': 'pager',
    '📠': 'fax_machine',            '🖨️': 'printer',               '🖱️': 'computer_mouse',        '🖲': 'trackball',
    '💽': 'optical_disc',           '💾': 'floppy_disk',             '📀': 'dvd',                    '🎥': 'movie_camera',
    '📹': 'video_camera',           '📷': 'camera',                 '📺': 'television',              '📻': 'radio',
    '🎙️': 'studio_microphone',      '🎚️': 'level_slider',           '🎛️': 'control_knobs',          '🔊': 'speaker',
    '🔇': 'speaker_with_cancellation_stroke', '🔈': 'speaker_with_one_sound_wave', '🔉': 'speaker_with_three_sound_waves', '📢': 'public_address_loudspeaker',
    '📣': 'cheering_megaphone',     '📏': 'straight_ruler',          '📐': 'triangular_ruler',        '✂️': 'scissors',
    '🗃️': 'card_file_box',         '🗄️': 'file_cabinet',           '🗑️': 'wastebasket',            '🔑': 'key',
    '🔒': 'locked',                '🔓': 'unlocked',               '🔏': 'locked_with_key',         '🔐': 'old_key',
    '🔨': 'hammer',                '🪓': 'axe',                   '⚒️': 'hammer_and_pick',        '🛠️': 'tools',
    '🔧': 'wrench',                '🔩': 'nut_and_bolt',           '⚙️': 'gear',                   '🗜️': 'clamp',
    '⚖️': 'balance_scale',         '🦯': 'white_cane',             '🔗': 'link',                   '⛓️': 'chains',
    '💉': 'syringe',               '🩸': 'drop_of_blood',          '🧬': 'dna',                    '🔬': 'microscope',
    '🔭': 'telescope',              '📡': 'satellite_antenna',      '💊': 'pill',                   '💉': 'syringe',
    '🩹': 'bandage',               '🧴': 'lotion_bottle',          '🧷': 'safety_pin',             '🧵': 'thread'
};

  // Text to emoji mappings (reverse of above)
  const textToEmoji = Object.fromEntries(
    Object.entries(emojiToText).map(([emoji, text]) => [text, emoji])
  );

  // Shortcode regex
  const shortcodeRegex = /:[a-zA-Z0-9_+-]+:/g;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2000}-\u{200D}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F200}-\u{1F2FF}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]/gu;

  const formatText = (text: string): string => {
    let formatted = text;
    
    switch (caseMode) {
      case "lower":
        formatted = formatted.toLowerCase();
        break;
      case "upper":
        formatted = formatted.toUpperCase();
        break;
      case "title":
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
        break;
      default:
        break;
    }

    if (addBrackets) {
      formatted = `[${formatted}]`;
    }

    return formatted;
  };
  
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  };
  

  const replaceEmojis = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to process.",
        variant: "destructive",
      });
      return;
    }

    let result = inputText;
    let replacedCount = 0;

    if (replacementMode === "text") {
      // Replace emojis with text descriptions
      result = result.replace(emojiRegex, (match) => {
        if (emojiToText[match]) {
          replacedCount++;
          return formatText(emojiToText[match]);
        }
        return match;
      });

      // Handle shortcodes if preserving them
      if (preserveShortcodes) {
        result = result.replace(shortcodeRegex, (match) => {
          const shortcode = match.slice(1, -1); // Remove colons
          if (textToEmoji[shortcode]) {
            replacedCount++;
            return formatText(shortcode);
          }
          return formatText(shortcode);
        });
      }
    } else if (replacementMode === "emoji") {
       // Replace text descriptions with emojis
        Object.entries(textToEmoji).forEach(([text, emoji]) => {
            // Create a flexible regex that handles different separators and casing
            const words = text.split('_');
            const pattern = words.map(escapeRegExp).join('[_\\s&]*');
            const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
            
            const matches = result.match(regex);
            if(matches) {
                replacedCount += matches.length;
                result = result.replace(regex, emoji);
            }

            // Handle shortcode version as well e.g. :waving_hand:
            const shortcodeRegex = new RegExp(`:${escapeRegExp(text)}:`, 'gi');
            const shortcodeMatches = result.match(shortcodeRegex);
            if(shortcodeMatches) {
                replacedCount += shortcodeMatches.length;
                result = result.replace(shortcodeRegex, emoji);
            }
        });
    } else if (replacementMode === "custom" && customReplacement.trim()) {
      // Replace all emojis with custom text
      result = result.replace(emojiRegex, () => {
        replacedCount++;
        return formatText(customReplacement);
      });

      if (preserveShortcodes) {
        result = result.replace(shortcodeRegex, () => {
          replacedCount++;
          return formatText(customReplacement);
        });
      }
    }

    setOutputText(result);

    toast({
      title: "Replacement Complete",
      description: `Replaced ${replacedCount} emoji${replacedCount !== 1 ? 's' : ''}.`,
    });
  };

  const copyToClipboard = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied!",
        description: "Converted text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText("");
  };

  const sampleTexts = [
    {
      name: "Text with Emojis",
      content: "I love coding! 😍💻 It's so much fun and rewarding! 🎉✨ Can't wait to ship this project! 🚀"
    },
    {
      name: "Mixed Content",
      content: "Meeting at 2pm 📅 Don't forget your laptop 💻 and coffee ☕ See you there! 👋😊"
    },
    {
      name: "Shortcodes",
      content: "Hello :wave: I'm feeling great today :smile: Let's build something amazing :rocket: :heart:"
    }
  ];

  const previewReplacements = () => {
    const emojis = inputText.match(emojiRegex) || [];
    const shortcodes = inputText.match(shortcodeRegex) || [];
    
    return [...new Set([...emojis, ...shortcodes])].slice(0, 10).map(item => {
      let replacement = "";
      
      if (replacementMode === "text") {
        if (item.startsWith(':') && item.endsWith(':')) {
          replacement = formatText(item.slice(1, -1));
        } else if (emojiToText[item]) {
          replacement = formatText(emojiToText[item]);
        }
      } else if (replacementMode === "emoji") {
        const text = item.startsWith(':') ? item.slice(1, -1) : emojiToText[item];
        replacement = textToEmoji[text] || item;
      } else if (replacementMode === "custom" && customReplacement.trim()) {
        replacement = formatText(customReplacement);
      }
      
      return { original: item, replacement };
    });
  };

  const previews = previewReplacements();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text">Input Text</Label>
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text with emojis or emoji descriptions..."
                  className="min-h-[200px] resize-none"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  Characters: {inputText.length}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Replacement Mode</Label>
                  <Select value={replacementMode} onValueChange={(value: "text" | "emoji" | "custom") => setReplacementMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Emoji to Text</SelectItem>
                      <SelectItem value="emoji">Text to Emoji</SelectItem>
                      <SelectItem value="custom">Custom Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {replacementMode === "custom" && (
                  <div>
                    <Label htmlFor="custom-replacement">Custom Replacement Text</Label>
                    <Input
                      id="custom-replacement"
                      value={customReplacement}
                      onChange={(e) => setCustomReplacement(e.target.value)}
                      placeholder="Enter replacement text..."
                    />
                  </div>
                )}

                <div>
                  <Label>Text Formatting</Label>
                  <Select value={caseMode} onValueChange={(value: "keep" | "lower" | "upper" | "title") => setCaseMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keep">Keep Original Case</SelectItem>
                      <SelectItem value="lower">lowercase</SelectItem>
                      <SelectItem value="upper">UPPERCASE</SelectItem>
                      <SelectItem value="title">Title Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preserve-shortcodes"
                      checked={preserveShortcodes}
                      onCheckedChange={(checked) => setPreserveShortcodes(checked as boolean)}
                    />
                    <Label htmlFor="preserve-shortcodes" className="text-sm">
                      Process shortcodes (:smile:, :heart:)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="add-brackets"
                      checked={addBrackets}
                      onCheckedChange={(checked) => setAddBrackets(checked as boolean)}
                    />
                    <Label htmlFor="add-brackets" className="text-sm">
                      Add brackets [text]
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={replaceEmojis} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Replace
                </Button>
                <Button variant="outline" onClick={swapTexts} disabled={!outputText}>
                  Swap Texts
                </Button>
                <Button variant="outline" onClick={clearText}>
                  Clear All
                </Button>
              </div>

              <div>
                <Label className="text-sm">Sample Texts</Label>
                <div className="space-y-2 mt-2">
                  {sampleTexts.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputText(sample.content)}
                      className="w-full justify-start text-left h-auto p-2"
                    >
                      <div>
                        <div className="font-medium">{sample.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {sample.content.substring(0, 60)}...
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="output-text">Converted Text</Label>
                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  placeholder="Converted text will appear here..."
                  className="min-h-[200px] resize-none bg-muted"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  Characters: {outputText.length}
                </div>
              </div>

              {previews.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Replacement Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-auto">
                      {previews.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                          <span className="font-mono">{item.original}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                          <span className="font-mono">{item.replacement || "No change"}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-2">Emoji to Text</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>😊 → smiling</div>
                    <div>❤️ → heart</div>
                    <div>🚀 → rocket</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Text to Emoji</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>smile → 😄</div>
                    <div>heart → ❤️</div>
                    <div>:rocket: → 🚀</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Features</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• Custom replacements</div>
                    <div>• Text formatting</div>
                    <div>• Shortcode support</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmojiReplacer;

