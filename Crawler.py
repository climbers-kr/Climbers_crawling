#-*- coding:utf-8 -*-

"""
Documentation

필요 라이브러리
urllib3
requests
beautifulsoup4

*주의 사항
많이 연속적으로 사용하면 네이버가 잠시 막는다 BAD REQUEST : 400 발생

*단점
1. 암벽등반으로 검색했는데 15개 밖에 안 줌
암벽등반으로 검색한 이유는 클라이밍으로 검색시 등산 장비 등 필요없는 정보가 나옴

*개선 방향
1-1. 쿼리문 page 개수를 찾아본다. 
1-2. 혹은 동별(ex. 목동)로 리스트 만들어서 합쳐서 돌려 전국 단위로 뽑을 수도 있을 것 같음.
2. 1-2의 예상되는 문제점으로는 필요없는 정보를 걸러야됨 만들어 놓은 json으로 거르면 될듯 아마
"""

from urllib import parse
import json
import os
import errno
import requests

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}

with open('./AreaList.json', encoding='utf-8') as json_file:
    area = json.load(json_file)

for key in area.keys():
    key_list = list(area.get(key))

    for search in key_list:
        keyword = key+' '+search+' '+'암벽등반'
        print(keyword)
        search_word = parse.quote(keyword)
        search_query = 'https://m.map.naver.com/search2/search.nhn?query='+search_word
        search_request = requests.get(search_query, headers=hdr)
        search_text = search_request.text

        var_searchResult = search_text.find('var searchResult')
        var_searchService = search_text.find('var searchService')

        search_result = search_text[var_searchResult + len('var searchResult ='):var_searchService].strip()[:-1]

        dict_search_result = json.loads(search_result)

        if dict_search_result['totalCount'] == 0:
            continue

        for detail in dict_search_result['site']['list']:
            detail_id = detail['id'][1:]
            detail_name = detail['name']

            try:
                if not (os.path.exists(detail_name)):
                    os.makedirs('./Result/'+detail_name)
                    print(detail_name)

                    detail_query = 'https://m.map.naver.com/search2/site.nhn?query='+search_word+'&sm=hty&style=v5&code='+detail_id
                    detail_request = requests.get(detail_query, headers=hdr)
                    detail_text = detail_request.text

                    siteview = detail_text.find('siteview : ')
                    distance = detail_text.find('distance : ')
                    detail_result = detail_text[siteview + len('siteview : '):distance].strip()[:-1]

                    dict_detail_result = json.loads(detail_result)

                    count = 0

                    for imgs in dict_detail_result['images']['imageList']:
                        img_url = imgs['url']
                        if count == 5:
                            dict_detail_result['images']['imageList'] = dict_detail_result['images']['imageList'][:5]
                            break

                        try:
                            download = requests.get(img_url, allow_redirects=True)
                            filename = detail_name+'_main'+str(count)+'_.jpg'
                            open('./Result/'+detail_name+'/'+ filename, 'wb').write(download.content)
                            count = count + 1

                            imgs['url'] = '/'+filename

                        except IndexError as e:
                            pass

                    with open('./json/'+detail_name + '.json', 'w', encoding="utf-8") as detail_file:
                        json.dump(dict_detail_result, detail_file, ensure_ascii=False, indent='\t')

            except OSError as e:
                if e.errno != errno.EEXIST:
                    print("Failed to create outFolder directory!!!!!")
                    raise
            except json.decoder.JSONDecodeError as j:
                #https://m.place.naver.com/ 으로 빠지는 경우
                print("Error : ", j)
                pass
            except Exception as ex:
                print("Error : ", ex)
                raise




