# Testaustyökalun valinta

Tässä dokumentissa käsitellään lyhyesti eri testaustyökalujen valintaa ja niiden käyttömahdollisuuksia. Hyödynnä työkalun valinnassa omaa aikaisempaa kokemustasi eri kielistä ja työkaluista, mutta pyri mahdollisuuksien salliessa tutustumaan myös uusiin vaihtoehtoihin. Alla on esitelty muutamia työkaluja, joista voit valita itsellesi sopivimman, tai voit etsiä lisää vaihtoehtoja esimerkiksi hakukoneita ja kielimalleja hyödyntäen.

## JavaScript- tai TypeScript-pohjaiset testit

Aikaisemmin käyttämistämme testaustyökaluista esimerkiksi Playwright ei välttämättä ole tällä kertaa suositeltava  valinta, sillä se on tarkoitettu pääasiassa selainpohjaisten käyttöliittymien testaamiseen, ja tällä kertaa testaamme REST-rajapintaa. Sen sijaan [Vitest](https://vitest.dev/) tukee Playwrightin kaltaisia testejä, joissa testit voidaan kirjoittaa JavaScriptillä tai TypeScriptillä.

HTTP-pyynnöt voidaan Vitestin kanssa tehdä tavanomaisesti esimerkiksi [`fetch`-funktiolla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/fetch) ja vastaukset voidaan tarkistaa Vitestin [`expect`-funktiolla](https://vitest.dev/api/expect.html).

Esimerkki Vitestillä kirjoitetusta testistä, joka tarkistaa, että `/health`-rajapinta palauttaa HTTP-statuksen 200:

```ts
import { test, expect } from 'vitest';

test('GET /health returns 200', async () => {
    const response = await fetch('http://localhost:3000/health');
    expect(response.status).toBe(200);
});
```

## Python-pohjaiset testit

Pythonilla on useita hyviä testauskirjastoja, joista esimerkiksi [pytest](https://docs.pytest.org/) on suosittu ja monipuolinen. Pytestin avulla voit kirjoittaa testejä Pythonin syntaksia käyttäen ja hyödyntää sen laajaa ekosysteemiä, esimerkiksi HTTP-pyyntöjen tekemiseen tarkoitettua [requests](https://docs.python-requests.org/)-kirjastoa.

Esimerkki pytestillä kirjoitetusta testistä, joka tarkistaa, että `/health`-rajapinta palauttaa HTTP-statuksen 200:

```python
import requests

def test_health_endpoint():
    response = requests.get('http://localhost:3000/health')
    assert response.status_code == 200
```

## REST- ja HTTP-testaustyökalut

Vitestin ja Pytestin avulla on mahdollista testata liki mitä tahansa, mutta joissain tapauksissa saatat haluta mieluummin juuri REST-rajapintojen testaamiseen tarkoitettuja työkaluja.

[Robot Frameworkin laajennoksista](https://robotframework.org/#resources) löytyykin juuri HTTP-pyyntöjen tekemiseen tarkoitettuja kirjastoja, joiden avulla voit kirjoittaa testisi Robot-syntaksia ja Robot Frameworkin komentoja käyttäen. Toisaalta Robot Frameworkin syntaksi esimerkiksi JSON-olioiden käsittelyssä voi vaatia hieman totuttelua, jos olet tottunut kirjoittamaan perinteisillä ohjelmointikielillä.

Lisäksi monet muut avoimen lähdekoodin työkalut, kuten [Bruno](https://www.usebruno.com/), tukevat HTTP-pyyntöjen tekemistä ja vastausten tarkistamista. Brunon vahvuuksiin kuuluvat mm. suoraviivainen komentorivikäyttö sekä paikallisesti että GitHub actionsissa. Esimerkkejä Brunon testitiedostoista löydät [Brunon dokumentaatiosta](https://docs.usebruno.com/opencollection-yaml/samples).

## Valmiit GitHub actions -työnkulut, laajennokset ja pilvipalvelut

Eri työkaluihin tutustuessasi saatat törmätä erilaisiin kaupallisiin sekä avoimen lähdekoodin GitHub actions -työnkulkuihin, laajennoksiin ja pilvipalveluihin, jotka tarjoavat erilaisia ratkaisuja testien suorittamiseen. Moni työkalu edellyttää esimerkiksi kirjautumista, API-avaimen luomista tai muita toimenpiteitä, jotta voit suorittaa testit. Tällaiset toimenpiteet voivat olla tässä tehtävässä tarpeettomia, jos haluat vain testata REST-rajapintaa paikallisesti ja GitHub actionsissa.

Suhtaudu siis tarjontaan kriittisesti ja pyri valitsemaan sellainen työkalu, joka ei edellytä tarpeettomia asennuksia, kirjautumisia tai muita toimenpiteitä. Ideaalitapauksessa valitsemasi työkalu asentuu yhdellä ja suorittaa testit toisella komennolla. On myös hyvä, jos työkalu mahdollistaa testien suorittamisen samalla tavalla sekä paikallisesti että GitHub actionsissa.
