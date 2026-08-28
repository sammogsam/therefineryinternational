import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not configured."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not configured."
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getStoragePath(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  try {
    const url = new URL(imageUrl);

    const marker =
      "/storage/v1/object/public/event-flyers/";

    const markerIndex =
      url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const storagePath = decodeURIComponent(
      url.pathname.substring(
        markerIndex + marker.length
      )
    );

    return storagePath;
  } catch (error) {
    console.error(
      "Could not determine storage path:",
      error
    );

    return null;
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    console.log("================================");
    console.log("STARTING EVENT DELETION");
    console.log("EVENT ID:", id);
    console.log("================================");

    /*
     * STEP 1:
     * Get the event from the database.
     */

    const {
      data: event,
      error: eventError,
    } = await supabaseAdmin
      .from("events")
      .select("id, title, image")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      console.error(
        "EVENT NOT FOUND:",
        eventError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            eventError?.message ||
            "Event not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "EVENT FOUND:",
      event.title
    );

    console.log(
      "FLYER URL:",
      event.image
    );

    /*
     * STEP 2:
     * Delete the flyer from Supabase Storage.
     */

    if (event.image) {
      const storagePath =
        getStoragePath(event.image);

      console.log(
        "STORAGE PATH:",
        storagePath
      );

      if (storagePath) {
        const {
          data: removedFiles,
          error: storageError,
        } = await supabaseAdmin.storage
          .from("event-flyers")
          .remove([storagePath]);

        console.log(
          "STORAGE REMOVE RESPONSE:",
          removedFiles
        );

        console.log(
          "STORAGE REMOVE ERROR:",
          storageError
        );

        if (storageError) {
          console.error(
            "FLYER DELETION FAILED:",
            storageError
          );

          return NextResponse.json(
            {
              success: false,
              error:
                "The flyer could not be deleted: " +
                storageError.message,
            },
            {
              status: 500,
            }
          );
        }

        console.log(
          "FLYER DELETED SUCCESSFULLY."
        );
      } else {
        console.warn(
          "Could not determine the flyer storage path."
        );
      }
    } else {
      console.log(
        "EVENT HAS NO FLYER."
      );
    }

    /*
     * STEP 3:
     * Delete the event from the database.
     */

    const {
      error: deleteEventError,
    } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteEventError) {
      console.error(
        "DATABASE EVENT DELETION FAILED:",
        deleteEventError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "The event could not be deleted: " +
            deleteEventError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "DATABASE EVENT DELETED SUCCESSFULLY."
    );

    console.log("================================");
    console.log(
      "EVENT AND FLYER DELETED SUCCESSFULLY"
    );
    console.log("================================");

    return NextResponse.json({
      success: true,
      message:
        "Event and flyer deleted successfully.",
    });
  } catch (error) {
    console.error(
      "UNEXPECTED SERVER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}