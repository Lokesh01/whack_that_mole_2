import json
import os
import time

source1 = str(raw_input('Enter path of Base File (json file) : '))
curr_path = os.path.dirname(os.path.realpath(__file__))

if (not (os.path.isdir(curr_path + '/converted/') and os.path.isdir(curr_path + '/missed/'))):
    access_rights = 0o755
    os.mkdir("converted", access_rights)
    os.mkdir("missed", access_rights)
    print('Created Directory for translations')
else:
    print('Directory Exists Continuing with Conversion')
    pass

# Edit this As per the translations Available
translations = ['ar', 'de', 'es', 'fr', 'hi',
                'id', 'ja', 'ko', 'ms', 'ru', 'zh', 'pt']
temp_conv = {}
temp_miss = {}

for language in translations:
    source2 = curr_path + '/' + language + '.json'
    dest = curr_path + '/converted/' + language + '.json'
    missed = curr_path + '/missed/' + language + '_missed.json'

    with open(source1, 'rb') as data_file1, open(source2, 'rb') as data_file2:
        data1 = json.loads(data_file1.read())
        data2 = json.loads(data_file2.read())

    for key in data1:
        if key in data2:
            temp_conv.update({key.encode('utf-8'): data2[key].encode('utf-8')})
        else:
            temp_miss.update({key.encode('utf-8'): data1[key].encode('utf-8')})

    with open(dest, 'w') as match:
        json.dump(temp_conv, match, indent=2, separators=(',', ': '), ensure_ascii=False)

    with open(missed, 'w') as miss:
        json.dump(temp_miss, miss, indent=2, separators=(',', ': '), ensure_ascii=False)
    time.sleep(5)
    temp_conv = {}
    temp_miss = {}
