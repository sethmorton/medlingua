const PATH = "http://10.189.95.23:8000/";
export const handler = async () => {
    const data = (await (await fetch(PATH)).json());
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  }